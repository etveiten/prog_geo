import React, { useState, useEffect, useContext } from "react";
import { union } from "@turf/turf";
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import { convertToPolygon } from "../../Utils/convertData";
import Alert from "@mui/material/Alert";
import { IconButton } from "@mui/material";
import Info from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { ReactComponent as InfoIcon } from "../../Icons/info-filled-svgrepo-com.svg";
import "./Union.css";
import { useIndexedDB } from "react-indexed-db-hook";

function Union() {
  const [dataFiles, setDataFiles] = useState([]);
  const [selectedFile1, setSelectedFile1] = useState("");
  const [selectedFile2, setSelectedFile2] = useState("");
  const [unionData, setUnionData] = useState(null);
  const [customLayerName, setCustomLayerName] = useState("");
  const [showInfo, setShowInfo] = useState(false);

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

  const handleFile1Select = (event) => {
    setSelectedFile1(event.target.value);
  };

  const handleFile2Select = (event) => {
    setSelectedFile2(event.target.value);
  };

  const handleCustomLayerNameChange = (event) => {
    setCustomLayerName(event.target.value);
  };

  const handleUnion = async () => {
    if (selectedFile1 && selectedFile2 && customLayerName) {
      const fileData1 = await getByIndex("name", selectedFile1);
      const fileData2 = await getByIndex("name", selectedFile2);

      const jsonData1 = JSON.parse(fileData1.data);
      const jsonData2 = JSON.parse(fileData2.data);

      const poly1 = convertToPolygon(jsonData1);
      const poly2 = convertToPolygon(jsonData2);

      if (poly1 && poly2) {
        const unionResult = union(poly1, poly2);
        const featureCollection = {
          type: "FeatureCollection",
          features: [unionResult],
        };
        setUnionData(featureCollection);

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
          opacity: 0.9,
          type: "Polygon",
        });

        setUnionData(true);

        setTimeout(() => {
          setUnionData(null);
          setSelectedFile1("");
          setSelectedFile2("");
        }, 3000);
      }
    }
  };

  const generateRandomColor = () => {
    const randomValue = () => Math.floor(Math.random() * 256);
    const color = `#${randomValue().toString(16).padStart(2, "0")}${randomValue()
      .toString(16)
      .padStart(2, "0")}${randomValue().toString(16).padStart(2, "0")}`;
    return color;
  };

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="union-container">
      <div className="union-header">
        <h3>Union</h3>
        <IconButton onClick={handleInfoClick}>
          <InfoIcon className="info-icon" />
        </IconButton>
        {showInfo && (
          <Alert
            className="union-message"
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
            Union operation merges two layers into one, combining their geometries.
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
            onClick={handleUnion}
            disabled={!selectedFile1 || !selectedFile2}
          >
            <span className="button-text">Union</span>
          </button>
        </div>
      </div>
      {unionData && (
        <Alert
          severity="success"
          onClose={() => setUnionData(null)}
          className="intersect-alert"
        >
          Union successfully done.
        </Alert>
      )}
    </div>
  );
}

export default Union;
