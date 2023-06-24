import React, { useState, useEffect, useContext } from "react";
import { LayersContext } from "../Layers/LayersContext";

function DataList() {
  // Context methods for the Layers
  const { addLayer, removeLayer, selectedLayers } = useContext(LayersContext);
  const [dataFiles, setDataFiles] = useState([]);

  useEffect(() => {
    const storedDataFiles = Object.keys(localStorage);
    setDataFiles(storedDataFiles);
  }, []);

  const isLayerSelected = (fileName) => {
    return selectedLayers && selectedLayers.includes(fileName);
  };

  const generateRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 256);
    const color = `#${randomValue().toString(16).padStart(2, '0')}${randomValue().toString(16).padStart(2, '0')}${randomValue().toString(16).padStart(2, '0')}`;
    return color;
  };

  const handleAddLayer = (fileName) => {
    if (!isLayerSelected(fileName)) {
      const fileData = localStorage.getItem(fileName);
      const extension = fileName.split(".").pop().toLowerCase();
      let layerUrl;

      if (extension === "json" || extension === "geojson") {
        layerUrl = URL.createObjectURL(new Blob([fileData]));
      } else if (extension === "shp") {
        // Handle Shapefile here (if needed)
      }

      if (layerUrl) {
        addLayer({
          name: fileName,
          url: layerUrl,
          color: generateRandomColor(),
          outlineColor: generateRandomColor(),
          opacity: 1,
        });
      }
    } else {
      removeLayer(fileName);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result;
        const fileName = file.name;
        localStorage.setItem(fileName, fileData);
        setDataFiles((prevDataFiles) => [...prevDataFiles, fileName]);
      };
      reader.readAsText(file);
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const isValidFile = (fileName) => {
    const validExtensions = ["json", "geojson", "shp"];
    const extension = fileName.split(".").pop().toLowerCase();
    return validExtensions.includes(extension);
  };

  return (
    <div>
      <h1>Data List</h1>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        Drop files here
      </div>
      <ul>
        {dataFiles.map((fileName) => {
          if (isValidFile(fileName)) {
            return (
              <li key={fileName}>
                {fileName}
                <button onClick={() => handleAddLayer(fileName)}>
                  {isLayerSelected(fileName) ? "Remove Layer" : "Add Layer"}
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
