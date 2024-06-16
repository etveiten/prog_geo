import React, { useState, useEffect, useContext } from "react";
import { difference } from "@turf/turf"; // Importing the 'difference' function from turf.js for geometric operations
import { LayersContext } from "../Sidebar/Layers/LayersContext"; // Importing Layers context to manage layers in the map
import { convertToPolygon } from "../../Utils/convertData"; // Importing utility function to convert data to polygon format
import { Alert, IconButton } from "@mui/material"; // Importing MUI components for UI elements
import Info from "@mui/icons-material/Info"; // Importing Info icon from MUI
import CloseIcon from "@mui/icons-material/Close"; // Importing Close icon from MUI
import { ReactComponent as InfoIcon } from "../../Icons/info-filled-svgrepo-com.svg"; // Importing custom Info icon
import "./Difference.css"; // Importing CSS for Difference component
import { useIndexedDB } from "react-indexed-db-hook"; // Importing IndexedDB hook for database operations

function Difference() {
  // Local states for the component
  const [dataFiles, setDataFiles] = useState([]); // State to store data files from IndexedDB
  const [selectedFile1, setSelectedFile1] = useState(""); // State to store the selected first file
  const [selectedFile2, setSelectedFile2] = useState(""); // State to store the selected second file
  const [differenceData, setDifferenceData] = useState(null); // State to store the result of the difference operation
  const [customLayerName, setCustomLayerName] = useState(""); // State for custom layer name
  const [showInfo, setShowInfo] = useState(false); // State to control the visibility of info alert

  const { addLayer, layerComponents } = useContext(LayersContext); // Context functions to add a layer and get layer components
  const { add, getAll, getByIndex } = useIndexedDB("files"); // IndexedDB hooks to add, get all and get by index

  // useEffect hook to fetch data files from IndexedDB on component mount and when layerComponents change
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAll(); // Get all data from IndexedDB
      const dataFiles = data.map((item) => item.name); // Extract file names
      setDataFiles(dataFiles); // Set file names to state
    };

    fetchData();
  }, [layerComponents]);

  // Handler for the first file selection
  const handleFile1Select = (event) => {
    setSelectedFile1(event.target.value);
  };

  // Handler for the second file selection
  const handleFile2Select = (event) => {
    setSelectedFile2(event.target.value);
  };

  // Handler for custom layer name change
  const handleCustomLayerNameChange = (event) => {
    setCustomLayerName(event.target.value);
  };

  // Function to calculate the difference between two files
  const handleDifference = async () => {
    if (selectedFile1 && selectedFile2 && customLayerName) {
      const fileData1 = await getByIndex("name", selectedFile1); // Get the selected first file data by name
      const fileData2 = await getByIndex("name", selectedFile2); // Get the selected second file data by name

      const jsonData1 = JSON.parse(fileData1.data); // Parse the first JSON data
      const jsonData2 = JSON.parse(fileData2.data); // Parse the second JSON data

      const poly1 = convertToPolygon(jsonData1); // Convert first JSON data to polygon
      const poly2 = convertToPolygon(jsonData2); // Convert second JSON data to polygon

      if (poly1 && poly2) {
        const differenceResult = difference(poly1, poly2); // Calculate the difference between two polygons
        const featureCollection = {
          type: "FeatureCollection",
          features: [differenceResult],
        };
        setDifferenceData(featureCollection); // Set difference data to state

        const layerColor = generateRandomColor(); // Generate random color for the layer
        await add({
          name: customLayerName + ".geojson",
          data: JSON.stringify(featureCollection),
          layerName: customLayerName,
        }); // Add difference data to IndexedDB

        // Add difference layer to the map
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

        setDifferenceData(true); // Set difference data state to true

        // Reset states after 3 seconds
        setTimeout(() => {
          setDifferenceData(null);
          setSelectedFile1("");
          setSelectedFile2("");
        }, 3000);
      }
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
        <h3>Difference</h3>
        <IconButton onClick={handleInfoClick}>
          <InfoIcon className="info-icon" />
        </IconButton>
        {showInfo && (
          <Alert
            className="difference-message"
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
            Difference operation creates a new layer that represents the geometric difference between the input layers.
          </Alert>
        )}
      </div>
      <div className="union-content">
        <div className="intersect-row">
          <div className="union-item1">
            <select
              id="file1"
              value={selectedFile1}
              onChange={handleFile1Select}
            >
              <option value="">Select Layer 1</option>
              {dataFiles.map((fileName) => (
                <option key={fileName} value={fileName}>
                  {fileName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="intersect-row">
          <div className="union-item1">
            <select
              id="file2"
              value={selectedFile2}
              onChange={handleFile2Select}
            >
              <option value="">Select Layer 2</option>
              {dataFiles.map((fileName) => (
                <option key={fileName} value={fileName}>
                  {fileName}
                </option>
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
              selectedFile1 && selectedFile2 ? "enabled" : ""
            }`}
            onClick={handleDifference}
            disabled={!selectedFile1 || !selectedFile2}
          >
            <span className="button-text">Difference</span>
          </button>
        </div>

        {differenceData && (
          <Alert
            severity="success"
            onClose={() => setDifferenceData(null)}
            sx={{ mt: 2, zIndex: 333 }}
            className="difference-alert"
          >
            Difference successfully done.
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Difference;
