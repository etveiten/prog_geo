import React, { useState, useEffect, useContext } from "react";
import { difference, polygon, multiPolygon } from "@turf/turf";
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

  const { addLayer, layerComponents } = useContext(LayersContext);
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

  const handleFile1Select = (event) => {
    setSelectedFile1(event.target.value);
  };

  const handleFile2Select = (event) => {
    setSelectedFile2(event.target.value);
  };

  //Calculate difference between two files, had to convert them to polygons from feauturelayers
  //This function is defined in Utils
  const handleDifference = async () => {
    if (selectedFile1 && selectedFile2) {
      const fileData1 = await getByIndex("name", selectedFile1);
      const fileData2 = await getByIndex("name", selectedFile2);
      
      const jsonData1 = JSON.parse(fileData1.data);
      const jsonData2 = JSON.parse(fileData2.data);

      const poly1 = convertToPolygon(jsonData1);
      const poly2 = convertToPolygon(jsonData2);

      if (poly1 && poly2) {
        const differenceResult = difference(poly1, poly2);
        setDifferenceData(differenceResult);

        const fileName = `${selectedFile1}_${selectedFile2}_diff.json`;
        add({ name: fileName, data: JSON.stringify(differenceResult)});
        addLayer({
          name: fileName,
          url: URL.createObjectURL(
            new Blob([JSON.stringify(differenceResult)], {
              type: "application/json",
            })
          ),
          color: "red",
          outlineColor: "black",
          opacity: 0.4,
        });

        setDifferenceData(true);

        setTimeout(() => {
          setDifferenceData(null); // Clear intersectData after 3 seconds
          setSelectedFile1(""); // Reset selectedFile1 to default value
          setSelectedFile2(""); // Reset selectedFile2 to default value
        }, 3000);
      }
    }
  };

  return (
    <div className="difference-container">
      <h3 className="difference-header">Difference</h3>
      <div className="difference-content">
        <div className="difference-row">
          <div className="difference-item">
            <label htmlFor="file1">Select File 1:</label>
          </div>
          <div className="difference-item2">
            <select
              id="file1"
              value={selectedFile1}
              onChange={handleFile1Select}
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
        <div className="difference-row2">
          <div className="difference-item3">
            <label htmlFor="file2">Select File 2:</label>
          </div>
          <div className="difference-item4">
            <select
              id="file2"
              value={selectedFile2}
              onChange={handleFile2Select}
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
        <div className="difference-row3">
          <button
            className="difference-button"
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
