import React, { useState, useEffect, useContext } from "react";
import { buffer, polygon } from "@turf/turf";
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import { Alert } from "@mui/material";
import "./Buffer.css";
import { useIndexedDB } from "react-indexed-db-hook";
import { ReactComponent as BufferIcon } from "../../Icons/buffer_1.svg";

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
      <div className="buffer-header">
        <h3>Buffer</h3>
      </div>
      <div className="file-select">
        <select id="file" value={selectedFile} onChange={handleFileSelect}>
          <option value="">Input Layer</option>
          {dataFiles.map((fileName) => (
            <option key={fileName} value={fileName}>
              {fileName}
            </option>
          ))}
        </select>
      </div>

      <div className="buffer-select">
        <label htmlFor="bufferSizeInput">Distance (m):</label>

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

      <div className="buffer-name">

        <input
          id="buffer-layer-name"
          type="text"
          value={customLayerName}
          onChange={handleCustomLayerNameChange}
          placeholder="Set new layer name here"
        />
      </div>

      <div className="buffer-button">
        <button
          className={`button ${
            selectedFile && bufferSize > 0 ? "enabled" : ""
          }`}
          onClick={handleBuffer}
          disabled={!selectedFile || bufferSize <= 0}
        >
          <span className="button-text">Buffer</span>
        </button>
      </div>
      {bufferedData && (
        <Alert
          severity="success"
          onClose={() => setBufferedData(null)}
          className="intersect-alert"
        >
          Buffer operation successfully done.
        </Alert>
      )}
    </div>
  );
}

export default BufferComponent;
