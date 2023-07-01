import React, { useState, useEffect, useContext, useMemo } from "react";
import { LayersContext } from "../Layers/LayersContext";
import "./DataList.css";

import { useIndexedDB } from "react-indexed-db-hook";
// Import icons
import { ReactComponent as AddIcon } from "../../../Icons/add-plus-square-svgrepo-com.svg";
import { ReactComponent as CheckIcon } from "../../../Icons/checkmark-square-svgrepo-com.svg";

function DataList() {
  // Context methods for the Layers
  const { addLayer, removeLayer, selectedLayers, layerComponents } =
    useContext(LayersContext);
  const [dataFiles, setDataFiles] = useState([]);
  const [itemColors, setItemColors] = useState({});
  const { add, getAll, getByIndex} = useIndexedDB("files");

  //Refresh the datalist every time a layerComponent is changed
  useEffect(() => {

    
    const fetchData = async () => {
      const data = await getAll();
      const dataFiles = data.map((item) => item.name);
      setDataFiles(dataFiles);

    };

    fetchData();
  }, [layerComponents]);

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
      } else if (extension === "shp") {
        // Handle Shapefile here (if needed)
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

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result;
        const fileName = file.name;

        // Add the file to IndexedDB
        add({ name: fileName, data: fileData });

        //Update the state of dataFiles
        setDataFiles((prevDataFiles) => [...prevDataFiles, fileName]);
      };
      reader.readAsText(file);
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

 
  //Check if the files are of valid types. I have defied this to be json and geojson
  const isValidFile = (fileName) => {
    const validExtensions = ["json", "geojson", "shp"];
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
          Drag and drop JSON or GeoJSON files here
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
