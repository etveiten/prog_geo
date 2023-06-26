import React, { useState, useEffect, useContext } from "react";
import { union} from "@turf/turf";
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import { convertToPolygon } from "../../Utils/convertData";
import Alert from "@mui/material/Alert";
import "./Union.css"

//Exactley the same as intersect, but with union instead
function Union() {
  const [dataFiles, setDataFiles] = useState([]);
  const [selectedFile1, setSelectedFile1] = useState("");
  const [selectedFile2, setSelectedFile2] = useState("");
  const [unionData, setUnionData] = useState(null);

  const { addLayer, layerComponents } = useContext(LayersContext);

  useEffect(() => {
    const storedDataFiles = Object.keys(localStorage);
    setDataFiles(storedDataFiles);
  }, [layerComponents]);

  const handleFile1Select = (event) => {
    setSelectedFile1(event.target.value);
  };

  const handleFile2Select = (event) => {
    setSelectedFile2(event.target.value);
  };

  const handleUnion = () => {
    if (selectedFile1 && selectedFile2) {
      const fileData1 = localStorage.getItem(selectedFile1);
      const fileData2 = localStorage.getItem(selectedFile2);
      const jsonData1 = JSON.parse(fileData1);
      const jsonData2 = JSON.parse(fileData2);

      const poly1 = convertToPolygon(jsonData1);
      const poly2 = convertToPolygon(jsonData2);

      if (poly1 && poly2) {
        const unionResult = union(poly1, poly2);
        setUnionData(unionResult);

        const fileName = `${selectedFile1}_U_${selectedFile2}.json`;
        localStorage.setItem(fileName, JSON.stringify(unionResult));
        addLayer({
          name: fileName,
          url: URL.createObjectURL(
            new Blob([JSON.stringify(unionResult)], {
              type: "application/json",
            })
          ),
          color: "blue",
          outlineColor: "black",
          opacity: 0.9,
        });

        setUnionData(true);

        setTimeout(() => {
          setUnionData(null); // Clear intersectData after 3 seconds
          setSelectedFile1(""); // Reset selectedFile1 to default value
          setSelectedFile2(""); // Reset selectedFile2 to default value
        }, 3000);
      }
    }
  };

return (
  <div className="intersect-container">
    <h3 className="intersect-header">Union</h3>
    <div className="intersect-content">
      <div className="intersect-row">
        <div className="intersect-item">
          <label htmlFor="union-file1">Select File 1:</label>
          <select
            id="union-file1"
            className="intersect-select-file"
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
        <div className="intersect-item2">
          <div id="file1"></div>
        </div>
      </div>
      <div className="intersect-row2">
        <div className="intersect-item3">
          <label htmlFor="union-file2">Select File 2:</label>
          <select
            id="union-file2"
            className="intersect-select-file"
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
        <div className="intersect-item4">
          <div id="file2"></div>
        </div>
      </div>
      <button
        className="intersect-button"
        onClick={handleUnion}
        disabled={!selectedFile1 || !selectedFile2}
      >
        Perform Union
      </button>
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
