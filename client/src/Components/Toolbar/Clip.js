import React, { useState, useEffect, useContext } from "react";
import clip from 'turf-clip'; // Importing turf-clip for geometric clipping
import { LayersContext } from "../Sidebar/Layers/LayersContext"; // Importing Layers context
import { Alert, IconButton } from "@mui/material"; // Importing MUI components for UI elements
import Info from "@mui/icons-material/Info"; // Importing Info icon from MUI
import CloseIcon from "@mui/icons-material/Close"; // Importing Close icon from MUI
import { ReactComponent as InfoIcon } from "../../Icons/info-filled-svgrepo-com.svg"; // Importing custom Info icon
import "./Clip.css"; // Importing CSS for Clip component
import { useIndexedDB } from "react-indexed-db-hook"; // Importing IndexedDB hook for database operations

function Clip() {
  // Local states for the component
  const [dataFiles, setDataFiles] = useState([]); // State to store data files from IndexedDB
  const [selectedSourceFile, setSelectedSourceFile] = useState(""); // State to store the selected source file for clipping
  const [selectedClipFile, setSelectedClipFile] = useState(""); // State to store the selected clip file for clipping
  const [clipData, setClipData] = useState(null); // State to store the result of the clip operation
  const [customLayerName, setCustomLayerName] = useState(""); // State for custom layer name
  const [showInfo, setShowInfo] = useState(false); // State to control the visibility of info alert
  
  const { addLayer, layerComponents } = useContext(LayersContext); // Context function to add a layer and get layer components
  const { add, getAll, getByIndex } = useIndexedDB("files"); // IndexedDB hooks to add, get all and get by index

  // useEffect hook to fetch data files from IndexedDB on component mount and when layerComponents change
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAll(); // Get all data from IndexedDB
      setDataFiles(data.map(item => item.name)); // Set file names to state
    };

    fetchData();
  }, [layerComponents]);

  // Handler for source file selection
  const handleSourceFileSelect = (event) => {
    setSelectedSourceFile(event.target.value);
  };

  // Handler for clip file selection
  const handleClipFileSelect = (event) => {
    setSelectedClipFile(event.target.value);
  };

  // Handler for custom layer name change
  const handleCustomLayerNameChange = (event) => {
    setCustomLayerName(event.target.value);
  };

  // Handler for performing clip operation
  const handleClip = async () => {
    if (selectedSourceFile && selectedClipFile && customLayerName) {
      const sourceData = await getByIndex("name", selectedSourceFile); // Get the selected source file data by name
      const clipData = await getByIndex("name", selectedClipFile); // Get the selected clip file data by name

      const sourceJson = JSON.parse(sourceData.data); // Parse the source JSON data
      const clipJson = JSON.parse(clipData.data); // Parse the clip JSON data

      const clippedResult = clip(sourceJson, clipJson); // Perform the clip operation

      // Wrap clipped result in a FeatureCollection if not already
      const featureCollection = clippedResult.type === 'FeatureCollection' ? clippedResult : {
        type: "FeatureCollection",
        features: [clippedResult],
      };
      setClipData(featureCollection); // Set clipped data to state

      const layerColor = generateRandomColor(); // Generate random color for the layer

      await add({
        name: customLayerName + ".geojson",
        data: JSON.stringify(featureCollection),
        layerName: customLayerName,
      }); // Add clipped data to IndexedDB

      // Add clipped layer to the map
      addLayer({
        name: customLayerName + ".geojson",
        layerName: customLayerName,
        url: URL.createObjectURL(
          new Blob([JSON.stringify(featureCollection)], {
            type: "application/json",
          })
        ),
        color: layerColor,
        outlineColor: "black",
        opacity: 1,
        type: "Polygon",
      });

      // Reset states after 3 seconds
      setTimeout(() => {
        setClipData(null);
        setSelectedSourceFile("");
        setSelectedClipFile("");
      }, 3000);
    }
  };

  // Function to generate random color
  const generateRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 256);
    const color = `#${randomValue().toString(16).padStart(2, "0")}${randomValue()
      .toString(16)
      .padStart(2, "0")}${randomValue().toString(16).padStart(2, "0")}`;
    return color;
  };

  // Handler for info button click
  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="union-container">
      <div className="union-header">
        <h3>Clip</h3>
        <IconButton onClick={handleInfoClick}>
          <InfoIcon className="info-icon" />
        </IconButton>
        {showInfo && (
          <Alert
            className="clip-message"
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
            Clip operation creates a new layer that represents the geometric intersection of the source layer and the clip layer.
          </Alert>
        )}
      </div>
      <div className="union-content">
        <div className="intersect-row">
          <div className="union-item1">
            <select
              id="file1"
              value={selectedSourceFile}
              onChange={handleSourceFileSelect}
            >
              <option value="">Select Source File</option>
              {dataFiles.map((fileName) => (
                <option key={fileName} value={fileName}>{fileName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="intersect-row">
          <div className="union-item1">
            <select
              id="clipFile"
              value={selectedClipFile}
              onChange={handleClipFileSelect}
            >
              <option value="">Select Clip File</option>
              {dataFiles.map((fileName) => (
                <option key={fileName} value={fileName}>{fileName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="intersect-item5">
          <div className="union-item">
            <input
              id="union-item"
              type="text"
              value={customLayerName}
              onChange={handleCustomLayerNameChange}
              placeholder="Set new layer name here"
            />
          </div>
        </div>

        <div className="union-button-div">
          <button
            className={`button ${
              selectedClipFile && selectedSourceFile ? "enabled" : ""
            }`}
            onClick={handleClip}
            disabled={!selectedClipFile || !selectedSourceFile}
          >
            <span className="button-text">Clip</span>
          </button>
        </div>

        {clipData && (
          <Alert
            severity="success"
            onClose={() => setClipData(null)}
            sx={{ mt: 2, zIndex: 333 }}
            className="clip-alert"
          >
            Clip operation successful.
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Clip;
