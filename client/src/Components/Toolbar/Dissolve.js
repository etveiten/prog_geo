import React, { useState, useEffect, useContext } from "react";
import { dissolve, polygon } from "@turf/turf";
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import { convertToPolygon } from "../../Utils/convertData";
import Alert from "@mui/material/Alert";
import "./Dissolve.css";
import { useIndexedDB } from "react-indexed-db-hook";

function Dissolve() {
  const [dataFiles, setDataFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [dissolveData, setDissolveData] = useState(null);
  


  const { addLayer, layerComponents } = useContext(LayersContext);
  const { add, getAll, getByIndex } = useIndexedDB("files");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAll();
      const dataFiles = data.map((item) => item.name);
      setDataFiles(dataFiles);
    };

    fetchData();
  }, [layerComponents]);

  const handleFileSelect = async (event) => {
    setSelectedFile(event.target.value);
    
    const fileData = await getByIndex("name", event.target.value);
    const jsonData = JSON.parse(fileData.data);

    const properties = jsonData.features[0]?.properties || {};
    const propertyNames = Object.keys(properties).filter(prop => prop !== "geometry");
    setPropertyOptions(propertyNames);
  };

  const handlePropertySelect = (event) => {
    setSelectedProperty(event.target.value);
  };

  const generateColor = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return `#${randomColor}`;
  };


  const handleDissolve = async () => {
    if (selectedFile) {
      const fileData = await getByIndex("name", selectedFile);
      const jsonData = JSON.parse(fileData.data);
  
      if (jsonData && jsonData.type === "FeatureCollection") {
        if (selectedProperty) {
          // Group features by the selected property and prepare them for dissolving
          const groupedFeatures = jsonData.features.reduce((acc, feature) => {
            const key = feature.properties[selectedProperty];
  
            // Check if the feature is a MultiPolygon
            if (feature.geometry.type === "MultiPolygon") {
              // Convert MultiPolygon to multiple Polygon features
              feature.geometry.coordinates.forEach(polygonCoords => {
                const polygonFeature = {
                  type: "Feature",
                  properties: feature.properties, // Copy properties from the original feature
                  geometry: {
                    type: "Polygon",
                    coordinates: polygonCoords
                  }
                };
                if (!acc[key]) acc[key] = [];
                acc[key].push(polygonFeature);
              });
            } else {
              if (!acc[key]) acc[key] = [];
              acc[key].push(feature);
            }
            return acc;
          }, {});
  
          Object.keys(groupedFeatures).forEach(key => {
            const groupFeatureCollection = {
              type: "FeatureCollection",
              features: groupedFeatures[key]
            };
            const dissolvedGroup = dissolve(groupFeatureCollection);
            const fileName = `${selectedFile.split('.')[0]}_${key}.geojson`;
            const uniqueColor = generateColor();
  
            add({ name: fileName, data: JSON.stringify(dissolvedGroup), layerName: fileName.split('.geojson')[0] });
            addLayer({
              name: fileName,
              layerName: fileName.split('.geojson')[0],
              url: URL.createObjectURL(new Blob([JSON.stringify(dissolvedGroup)], { type: "application/json" })),
              color: uniqueColor,
              outlineColor: "black",
              opacity: 1.0,
            });
          });
        } else {
          // Standard dissolve operation
          const featuresPreparedForDissolve = jsonData.features.map(feature => {
            if (feature.geometry.type === "MultiPolygon") {
              return feature.geometry.coordinates.map(polygonCoords => ({
                type: "Feature",
                properties: feature.properties, // Copy properties from the original feature
                geometry: {
                  type: "Polygon",
                  coordinates: polygonCoords
                }
              })).flat();
            } else {
              return feature;
            }
          }).flat();
  
          const preparedFeatureCollection = {
            type: "FeatureCollection",
            features: featuresPreparedForDissolve
          };
  
          const dissolveResult = dissolve(preparedFeatureCollection);
          const fileName = `${selectedFile.split('.')[0]}_dissolved.geojson`;
          const uniqueColor = generateColor();
  
          add({ name: fileName, data: JSON.stringify(dissolveResult), layerName: fileName.split('.geojson')[0] });
          addLayer({
            name: fileName,
            layerName: fileName.split('.geojson')[0],
            url: URL.createObjectURL(new Blob([JSON.stringify(dissolveResult)], { type: "application/json" })),
            color: uniqueColor,
            outlineColor: "black",
            opacity: 0.5,
          });
        }
  
        setDissolveData(true);
        setTimeout(() => {
          setDissolveData(null);
          setSelectedFile("");
          setSelectedProperty("");
        }, 10000);
      }
    }
  };
  
  

  return (
    <div className="dissolve-container">
      <h3 className="dissolve-header">Dissolve</h3>
      <div className="dissolve-content">
        <div className="dissolve-row">
          <div className="dissolve-item">
            <label htmlFor="file">Select File:</label>
          </div>
          <div className="dissolve-item2">
            <select
              id="file"
              value={selectedFile}
              onChange={handleFileSelect}
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
  
        <div className="dissolve-row">
          <div className="dissolve-item">
            <label htmlFor="property">Select Property:</label>
          </div>
          <div className="dissolve-item2">
            <select
              id="property"
              value={selectedProperty}
              onChange={handlePropertySelect}
            >
              <option value="">-- Select a property --</option>
              {propertyOptions.map((propName) => (
                <option key={propName} value={propName}>
                  {propName}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className="dissolve-row2">
          <button
            className="dissolve-button"
            onClick={handleDissolve}
            disabled={!selectedFile}
          >
            <span className="button-text">Dissolve</span>
          </button>
        </div>
        {dissolveData && (
          <Alert
            severity="success"
            onClose={() => setDissolveData(null)}
            sx={{ mt: 2, zIndex: 333 }}
            className="dissolve-alert"
          >
            Dissolve successfully done.
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Dissolve;