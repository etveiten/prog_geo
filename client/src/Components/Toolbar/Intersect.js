import React, { useState, useEffect, useContext } from "react";
import { intersect, polygon, multiPolygon } from "@turf/turf";
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import { convertToPolygon } from "../../Utils/convertData";
import Alert from "@mui/material/Alert";
import "./Intersect.css";
import { useIndexedDB } from "react-indexed-db-hook";

function Intersect() {
  const [dataFiles, setDataFiles] = useState([]);
  const [selectedFile1, setSelectedFile1] = useState("");
  const [selectedFile2, setSelectedFile2] = useState("");
  const [intersectData, setIntersectData] = useState(null);

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

  //Sort of the same as buffer, Did reuse most of the components 
  const handleIntersection = async () => {
    if (selectedFile1 && selectedFile2) {
      const fileData1 = await getByIndex("name", selectedFile1);
      const fileData2 = await getByIndex("name", selectedFile2);
      
      const jsonData1 = JSON.parse(fileData1.data);
      const jsonData2 = JSON.parse(fileData2.data);

      const poly1 = convertToPolygon(jsonData1);
      const poly2 = convertToPolygon(jsonData2);

      if (poly1 && poly2) {
        const intersection = intersect(poly1, poly2);
        setIntersectData(intersection);

        const fileName = `intersected_${selectedFile1}_${selectedFile2}.json`;
        add({ name: fileName, data: JSON.stringify(intersection)});
        addLayer({
          name: fileName,
          url: URL.createObjectURL(
            new Blob([JSON.stringify(intersection)], {
              type: "application/json",
            })
          ),
          color: "gray",
          outlineColor: "black",
          opacity: 0.4,
        });

        setIntersectData(true);

        setTimeout(() => {
          setIntersectData(null); // Clear intersectData after 3 seconds
          setSelectedFile1(""); // Reset selectedFile1 to default value
          setSelectedFile2(""); // Reset selectedFile2 to default value
        }, 3000);
      }
    }
  };

  return (
    <div className="intersect-container">
      <h3 className="intersect-header">Intersect</h3>
      <div className="intersect-content">
        <div className="intersect-row">
          <div className="intersect-item">
            <label htmlFor="file1">Select File 1:</label>
          </div>
          <div className="intersect-item2">
            <select id="file1" value={selectedFile1} onChange={handleFile1Select}>
              <option value="">-- Select a file --</option>
              {dataFiles.map((fileName) => (
                <option key={fileName} value={fileName}>
                  {fileName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="intersect-row2">
          <div className="intersect-item3">
            <label htmlFor="file2">Select File 2:</label>
          </div>
          <div className="intersect-item4">
            <select id="file2" value={selectedFile2} onChange={handleFile2Select}>
              <option value="">-- Select a file --</option>
              {dataFiles.map((fileName) => (
                <option key={fileName} value={fileName}>
                  {fileName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="intersect-row3">
          <button
            className="intersect-button"
            onClick={handleIntersection}
            disabled={!selectedFile1 || !selectedFile2}
          >
            <span className="button-text">Intersection</span>
          </button>
        </div>
        {intersectData && (
          <Alert
            severity="success"
            onClose={() => setIntersectData(null)}
            sx={{ mt: 2 }}
            className="intersect-alert"
          >
            Intersection successfully done.
          </Alert>
        )}
      </div>
    </div>
  );
  
}

export default Intersect;
