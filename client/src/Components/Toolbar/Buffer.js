import React, { useState, useEffect, useContext } from "react";
import { buffer, polygon } from "@turf/turf"; // Importing turf.js functions for buffer and polygon operations
import { LayersContext } from "../Sidebar/Layers/LayersContext"; // Importing the context for managing layers
import { Alert, IconButton } from "@mui/material"; // Importing MUI components for UI elements
import Info from "@mui/icons-material/Info"; // Importing Info icon from MUI
import CloseIcon from "@mui/icons-material/Close"; // Importing Close icon from MUI
import { ReactComponent as InfoIcon } from "../../Icons/info-filled-svgrepo-com.svg"; // Importing custom Info icon
import "./Buffer.css"; // Importing CSS for Buffer component
import { useIndexedDB } from "react-indexed-db-hook"; // Importing IndexedDB hook for database operations

function BufferComponent() {
  // Local states for the component
  const [dataFiles, setDataFiles] = useState([]); // State to store data files from IndexedDB
  const [selectedFile, setSelectedFile] = useState(""); // State to store the selected file for buffering
  const [bufferSize, setBufferSize] = useState(100); // State to store the buffer size
  const [bufferedData, setBufferedData] = useState(null); // State to store the buffered data
  const [showAlert, setShowAlert] = useState(false); // State to control the visibility of success alert
  const [customLayerName, setCustomLayerName] = useState(""); // State to store custom layer name
  const [showInfo, setShowInfo] = useState(false); // State to control the visibility of info alert
  const { addLayer } = useContext(LayersContext); // Context function to add a layer
  const { add, getAll, getByIndex } = useIndexedDB("files"); // IndexedDB hooks to add, get all and get by index

  // useEffect hook to fetch data files from IndexedDB on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAll(); // Get all data from IndexedDB
      const dataFiles = data.map((item) => item.name); // Extract file names
      setDataFiles(dataFiles); // Set file names to state
    };

    fetchData();
  }, []);

  // Handler for file selection
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.value);
  };

  // Handler for buffer size change
  const handleBufferSizeChange = (event) => {
    const value = event.target.value.trim();
    if (value === "" || !isNaN(value)) {
      setBufferSize(value === "" ? "" : parseInt(value));
    }
  };

  // Handler for custom layer name change
  const handleCustomLayerNameChange = (event) => {
    setCustomLayerName(event.target.value);
  };

  // Handler for performing buffer operation
  const handleBuffer = async () => {
    if (selectedFile && customLayerName) {
      const fileData = await getByIndex("name", selectedFile); // Get the selected file data by name
      const jsonData = JSON.parse(fileData.data); // Parse the JSON data

      let buffered;
      if (jsonData.type === "LineString") {
        // Handle LineString type data
        const polygonBuffer = buffer(jsonData, bufferSize, { units: "meters" }); // Create buffer
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
        // Handle other types of data
        buffered = buffer(jsonData, bufferSize, { units: "meters" }); // Create buffer
      }

      setBufferedData(buffered); // Set buffered data to state

      const layerColor = generateRandomColor(); // Generate random color for the layer
      await add({
        name: customLayerName + ".geojson",
        data: JSON.stringify(buffered),
        layerName: customLayerName,
      }); // Add buffered data to IndexedDB

      // Add buffered layer to the map
      addLayer({
        name: customLayerName + ".geojson",
        layerName: customLayerName,
        url: URL.createObjectURL(
          new Blob([JSON.stringify(buffered)], { type: "application/json" })
        ),
        color: layerColor,
        outlineColor: "black",
        opacity: 1.0,
        type: "Polygon"
      });

      // Show success alert
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  // Function to generate random color
  const generateRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 256);
    const color = `#${randomValue().toString(16).padStart(2, "0")}${randomValue().toString(16).padStart(2, "0")}${randomValue().toString(16).padStart(2, "0")}`;
    return color;
  };

  // Handler for info button click
  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="buffer-container">
      <div className="buffer-header">
        <h3>Buffer</h3>
        <IconButton onClick={handleInfoClick} >
          <InfoIcon className="sidebar-icon" />
        </IconButton>
        {showInfo && (
          <Alert
            className="buffer-message"
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleInfoClick}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Buffer operation creates a new layer that represents areas within a specified distance around the input layer's features.
          </Alert>
        )}
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
          className={`button ${selectedFile && bufferSize > 0 ? "enabled" : ""}`}
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
