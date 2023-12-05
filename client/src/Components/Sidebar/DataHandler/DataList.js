import React, { useState, useEffect, useContext, useMemo } from "react";
import { LayersContext } from "../Layers/LayersContext";
import "./DataList.css";

import { useIndexedDB } from "react-indexed-db-hook";
// Import icons
import { ReactComponent as AddIcon } from "../../../Icons/add-plus-square-svgrepo-com.svg";
import { ReactComponent as CheckIcon } from "../../../Icons/checkmark-square-svgrepo-com.svg";
import axios from "axios";

function DataList() {
  // Context methods for the Layers
  const { addLayer, removeLayer, selectedLayers, layerComponents } =
    useContext(LayersContext);
  const [dataFiles, setDataFiles] = useState([]);
  const [itemColors, setItemColors] = useState({});
  const { add, getAll, getByIndex } = useIndexedDB("files");

  //Refresh the datalist every time a layerComponent is changed
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAll();
      const dataFiles = data.map((item) => item.name);
      setDataFiles(dataFiles);
    };

    fetchData();
  }, [layerComponents, dataFiles]);

  //Update the colors of the items in the list
  useEffect(() => {
    const newColors = {};
    layerComponents.forEach((layer) => {
      newColors[layer.name] = layer.color;
    });
    setItemColors(newColors);
  }, [layerComponents]);

  //Check if the layer is selected
  const isLayerSelected = (fileName) => {
    return (
      (selectedLayers && selectedLayers.includes(fileName)) ||
      layerComponents.some((layer) => layer.name === fileName)
    );
  };
  //Generate radnom color for the first render
  const generateRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 256);
    const color = `#${randomValue()
      .toString(16)
      .padStart(2, "0")}${randomValue()
      .toString(16)
      .padStart(2, "0")}${randomValue().toString(16).padStart(2, "0")}`;
    return color;
  };

  //Logic for adding a layer to the map. If its not selected, the item, aka object with data
  //is procecced and added to the map.
  const handleAddLayer = async (fileName) => {
    if (!isLayerSelected(fileName)) {
      const fileData = await getByIndex("name", fileName);

      const extension = fileName.split(".").pop().toLowerCase();
      let layerUrl;
      let layerColor = "";

      if (extension === "json" || extension === "geojson") {
        const jsonData = JSON.parse(fileData.data);
        if (jsonData.features && jsonData.features.length > 0) {
          const geometryType = jsonData.features[0].geometry.type;
          layerUrl = URL.createObjectURL(new Blob([fileData.data]));
          layerColor = generateRandomColor();
          addLayer({
            name: fileName,
            url: layerUrl,
            color: layerColor,
            outlineColor: generateRandomColor(),
            opacity: 1,
            type: geometryType, // Set the layer type based on the first feature's geometry type
          });
        }
      }
      //Handle the url for a database item and set colors
      if (layerUrl) {
        setItemColors((prevColors) => ({
          ...prevColors,
          [fileName]: layerColor,
        }));
      }
    } else {
      removeLayer(fileName);
      setItemColors((prevColors) => {
        const updatedColors = { ...prevColors };
        delete updatedColors[fileName];
        return updatedColors;
      });
    }
  };

  //Code for dropping files into the filedropper

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    for (const file of files) {
      const fileName = file.name;
      const extension = fileName.split(".").pop().toLowerCase();

      if (isValidFileExtension(extension)) {
        // Handle JSON and GeoJSON files as before
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = reader.result;

          // Add the file to IndexedDB
          add({ name: fileName, data: fileData });

          // Update the state of dataFiles
          setDataFiles((prevDataFiles) => [...prevDataFiles, fileName]);
        };
        reader.readAsText(file);
      } 
      
      else if (extension === "zip") {
        // Handle ZIP files by sending them to the backend for processing
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(
            "http://localhost:8080/process-zip",
            formData
          );

          if (response.status === 200 && response.data) {
            // Assuming the backend returns the processed JSON in the response
            const processedJsonData = response.data;
            // Modify the file name to replace .zip with .json
            const modifiedFileName = fileName.replace(/\.zip$/, ".json");
            // Add the file to IndexedDB
            add({ name: modifiedFileName, data: processedJsonData.data });

            // Update the state of dataFiles
            setDataFiles((prevDataFiles) => [...prevDataFiles, fileName]);
          }
        } catch (error) {
          console.error("Error processing ZIP file:", error);
        }
      } else if (extension === "gml") {
        // Handle GML files by sending them to the backend for processing
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(
            "http://localhost:8080/process-gml",
            formData
          );

          if (response.status === 200 && response.data) {
            // Assuming the backend returns the processed JSON in the response
            const processedJsonData = response.data.data;
            // Modify the file name to replace .gml with .json
            const modifiedFileName = fileName.replace(/\.gml$/, ".json");
            // Add the file to IndexedDB
            add({ name: modifiedFileName, data: processedJsonData });

            // Update the state of dataFiles
            setDataFiles((prevDataFiles) => [...prevDataFiles, fileName]);
          }
        } catch (error) {
          console.error("Error processing GML file:", error);
        }

      } else {
        // Handle invalid file extension (e.g., show an error message)
        console.error(`Invalid file extension: ${extension}`);
      }
    }
  };

  // Function to check if the file extension is valid (e.g., json or geojson)
  const isValidFileExtension = (extension) => {
    const validExtensions = ["json", "geojson"];
    return validExtensions.includes(extension);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  //Check if the files are of valid types. I have defied this to be json and geojson
  const isValidFile = (fileName) => {
    const validExtensions = ["json", "geojson"];
    const extension = fileName.split(".").pop().toLowerCase();
    return validExtensions.includes(extension);
  };

  const getItemColors = useMemo(() => {
    const colors = {};
    layerComponents.forEach((layer) => {
      colors[layer.name] = layer.color;
    });
    return colors;
  }, [layerComponents]);

  return (
    <div className="data-container">
      <div
        className="data-files-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
          width: "80%",
          height: "100px",
        }}
      >
        <span className="data-files-dropzone-text">
          Drag and drop JSON, GeoJSON or zipped Shapefiles files here
        </span>
      </div>
      <ul className="data-files-list">
        {dataFiles.map((fileName) => {
          if (isValidFile(fileName)) {
            const itemColor = getItemColors[fileName] || "transparent";
            const itemColorWithAlpha = `${itemColor}30`; // Add alpha value (30 in hex is equivalent to 0.3 in decimal)
            return (
              <li key={fileName} className="data-files-item">
                <span className="data-file-name">{fileName}</span>
                <button
                  className="add-button"
                  onClick={
                    !isLayerSelected(fileName)
                      ? () => handleAddLayer(fileName)
                      : null
                  }
                  style={{
                    backgroundColor: isLayerSelected(fileName)
                      ? itemColorWithAlpha
                      : "transparent",
                  }}
                >
                  {isLayerSelected(fileName) ? (
                    <CheckIcon width="20px" height="20px" />
                  ) : (
                    <AddIcon width="20px" height="20px" />
                  )}
                </button>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}

export default DataList;
