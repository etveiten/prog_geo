import React, { useState, useEffect, useContext } from "react";
import { difference } from "@turf/turf";
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import { convertToPolygon } from "../../Utils/convertData";
import Alert from "@mui/material/Alert";
import "./Difference.css";
import { useIndexedDB } from "react-indexed-db-hook";

function Difference() {
  const [dataFiles, setDataFiles] = useState([]);
  const [selectedFile1, setSelectedFile1] = useState("");
  const [selectedFile2, setSelectedFile2] = useState("");
  const [differenceData, setDifferenceData] = useState(null);
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

  const handleFile1Select = (event) => {
    setSelectedFile1(event.target.value);
  };

  const handleFile2Select = (event) => {
    setSelectedFile2(event.target.value);
  };

  const handleCustomLayerNameChange = (event) => {
    setCustomLayerName(event.target.value);
  };

  //Calculate difference between two files, had to convert them to polygons from feature layers
  const handleDifference = async () => {
    if (selectedFile1 && selectedFile2 && customLayerName) {
      const fileData1 = await getByIndex("name", selectedFile1);
      const fileData2 = await getByIndex("name", selectedFile2);

      const jsonData1 = JSON.parse(fileData1.data);
      const jsonData2 = JSON.parse(fileData2.data);

      const poly1 = convertToPolygon(jsonData1);
      const poly2 = convertToPolygon(jsonData2);

      if (poly1 && poly2) {
        const differenceResult = difference(poly1, poly2);
        const featureCollection = {
          type: "FeatureCollection",
          features: [differenceResult],
        };
        setDifferenceData(featureCollection);

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

        setDifferenceData(true);

        setTimeout(() => {
          setDifferenceData(null);
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

  return (
    <div className="union-container">
      <div className="union-header">
        <h3>Difference</h3>
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
