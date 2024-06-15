import React, { useState, useEffect, useContext } from "react";
import clip from 'turf-clip';
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import Alert from "@mui/material/Alert";
import "./Clip.css";
import { useIndexedDB } from "react-indexed-db-hook";

function Clip() {
  const [dataFiles, setDataFiles] = useState([]);
  const [selectedSourceFile, setSelectedSourceFile] = useState("");
  const [selectedClipFile, setSelectedClipFile] = useState("");
  const [clipData, setClipData] = useState(null);
  const [customLayerName, setCustomLayerName] = useState(""); // State for custom layer name

  const { addLayer, layerComponents } = useContext(LayersContext);
  const { add, getAll, getByIndex } = useIndexedDB("files");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAll();
      setDataFiles(data.map(item => item.name));
    };

    fetchData();
  }, [layerComponents]);

  const handleSourceFileSelect = (event) => {
    setSelectedSourceFile(event.target.value);
  };

  const handleClipFileSelect = (event) => {
    setSelectedClipFile(event.target.value);
  };

  const handleCustomLayerNameChange = (event) => {
    setCustomLayerName(event.target.value);
  };

  const handleClip = async () => {
    if (selectedSourceFile && selectedClipFile && customLayerName) {
      const sourceData = await getByIndex("name", selectedSourceFile);
      const clipData = await getByIndex("name", selectedClipFile);

      const sourceJson = JSON.parse(sourceData.data);
      const clipJson = JSON.parse(clipData.data);

      const clippedResult = clip(sourceJson, clipJson);

      // Wrap clipped result in a FeatureCollection if not already
      const featureCollection = clippedResult.type === 'FeatureCollection' ? clippedResult : {
        type: "FeatureCollection",
        features: [clippedResult],
      };
      setClipData(featureCollection);

      const layerColor = generateRandomColor();

      await add({
        name: customLayerName + ".geojson",
        data: JSON.stringify(featureCollection),
        layerName: customLayerName,
      });

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

      setTimeout(() => {
        setClipData(null);
        setSelectedSourceFile("");
        setSelectedClipFile("");
      }, 3000);
    }
  };

  const generateRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 256);
    const color = `#${randomValue().toString(16).padStart(2, "0")}${randomValue()
      .toString(16)
      .padStart(2, "0")}${randomValue().toString(16).padStart(2, "0")}`;
    return color;
  };

  return (
    <div className="union-container">
      <div className="union-header">
        <h3>Clip</h3>
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
