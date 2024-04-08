import React, { useState, useEffect, useContext } from "react";
import { buffer, polygon } from "@turf/turf";
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import { Alert } from "@mui/material";
import "./Buffer.css";
import { useIndexedDB } from "react-indexed-db-hook";

//Component that handles the buffer functionality

function BufferComponent() {
  //Local state variables for the component to work properly and context to add the new layer to the map
  const [dataFiles, setDataFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [bufferSize, setBufferSize] = useState(100);
  const [bufferedData, setBufferedData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [customLayerName, setCustomLayerName] = useState(""); // State for custom layer name

  const { addLayer, layerComponents } = useContext(LayersContext);
  const { add, getAll, getByIndex } = useIndexedDB("files");

  //Refresh the datalist every time a layerComponent is changed
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAll();
      const dataFiles = data.map((item) => item.name);
      setDataFiles(dataFiles);
    };

    fetchData();
  }, [layerComponents]);

  //Functions to handle the file selection and buffer size
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.value);
  };

  //Handling of bad buffer sizes
  const handleBufferSizeChange = (event) => {
    const value = event.target.value.trim();
    if (value === "" || !isNaN(value)) {
      setBufferSize(value === "" ? "" : parseInt(value));
    }
  };

  const handleCustomLayerNameChange = (event) => {
    setCustomLayerName(event.target.value);
  };

  //Convertion and buffering of the selected file
  const handleBuffer = async () => {
    if (selectedFile && customLayerName) {
      //add the files for the layer to a const
      const fileData = await getByIndex("name", selectedFile);
      const jsonData = JSON.parse(fileData.data);

      let buffered;
      //If linestring, convert to polygon and then buffer
      if (jsonData.type === "LineString") {
        const polygonBuffer = buffer(jsonData, bufferSize, { units: "meters" });
        const polygonCoords = [polygonBuffer.geometry.coordinates[0]];
        buffered = {
          ...polygonBuffer,
          geometry: {
            ...polygonBuffer.geometry,
            type: "Polygon",
            coordinates: polygonCoords,
          },
        };
      } else {
        //Buffer the polygon or multipolygon
        buffered = buffer(jsonData, bufferSize, { units: "meters" });
      }

      setBufferedData(buffered);

      //Adding the buffered layer to the map
      add({
        name: customLayerName + ".geojson",
        data: JSON.stringify(buffered),
        layerName: customLayerName,
      });
      addLayer({
        name: customLayerName + "geojson",
        layerName: customLayerName,
        url: URL.createObjectURL(
          new Blob([JSON.stringify(buffered)], { type: "application/json" })
        ),
        color: "gray",
        outlineColor: "black",
        opacity: 1.0,
      });

      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  return (
    <div className="buffer-container">
      <h3 className="buffer-header">Buffer</h3>
      <div className="buffer-content">
        <div className="buffer-row-1">
          <div className="item item1">
            <label htmlFor="fileInput">Select a file:</label>
          </div>
          <div className="item item2">
            <select
              id="fileInput"
              value={selectedFile}
              onChange={handleFileSelect}
              className="buffer-select"
            >
              <option value="">-- Select a file --</option>
              {dataFiles.map((fileName) => (
                <option key={fileName} value={fileName}>
                  {fileName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="buffer-row-2">
          <div className="item item3">
            <label htmlFor="bufferSizeInput">Buffer Size (m):</label>
          </div>
          <div className="item item4">
            <input
              id="buffer-size-input"
              type="number"
              min="-1"
              value={bufferSize}
              onChange={handleBufferSizeChange}
            />
          </div>
        </div>
        <div className="buffer-row-3">
          <button
            className={`buffer-button ${
              selectedFile && bufferSize > 0 ? "enabled" : ""
            }`}
            onClick={handleBuffer}
            disabled={!selectedFile || bufferSize <= 0}
          >
            <span className="button-text">Buffer</span>
          </button>
        </div>
        <div className="buffer-row-4">
          <div className="item">
            <label htmlFor="customLayerNameInput">Custom Layer Name:</label>
          </div>
          <div className="item">
            <input
              id="customLayerNameInput"
              type="text"
              value={customLayerName}
              onChange={handleCustomLayerNameChange}
            />
          </div>
        </div>
        {showAlert && (
          <Alert
            severity="success"
            onClose={() => setShowAlert(false)}
            sx={{ mt: 2, zIndex: 333 }}
          >
            Buffer successfully done.
          </Alert>
        )}
      </div>
    </div>
  );
}

export default BufferComponent;
