import React, { useState, useEffect, useContext } from "react";
import { union} from "@turf/turf";
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import { convertToPolygon } from "../../Utils/convertData";
import Alert from "@mui/material/Alert";
import "./Union.css"
import { useIndexedDB } from "react-indexed-db-hook";

//Exactley the same as intersect, but with union instead
function Union() {
  const [dataFiles, setDataFiles] = useState([]);
  const [selectedFile1, setSelectedFile1] = useState("");
  const [selectedFile2, setSelectedFile2] = useState("");
  const [unionData, setUnionData] = useState(null);
  const [customLayerName, setCustomLayerName] = useState(""); // State for custom layer name


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

  const handleCustomLayerNameChange = (event) => {
    setCustomLayerName(event.target.value);
  };


  const handleUnion = async () => {
    if (selectedFile1 && selectedFile2) {
      const fileData1 = await getByIndex("name", selectedFile1);
      const fileData2 = await getByIndex("name", selectedFile2);
      
      const jsonData1 = JSON.parse(fileData1.data);
      const jsonData2 = JSON.parse(fileData2.data);

      const poly1 = convertToPolygon(jsonData1);
      const poly2 = convertToPolygon(jsonData2);

      if (poly1 && poly2 && customLayerName) {
        const unionResult = union(poly1, poly2);
        setUnionData(unionResult);

        
        add({ name: customLayerName + '.geojson', data: JSON.stringify(unionResult), layerName: customLayerName});
        addLayer({
          name: customLayerName + '.geojson',
          layerName: customLayerName + '.geojson',
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
          <label htmlFor="file1">Select File 1:</label>
        </div>
        <div className="intersect-item2">
        <select id="file1" value={selectedFile1} onChange={handleFile1Select}>
              <option value="">Select File 1</option>
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
              <option value="">Select file 2</option>
              {dataFiles.map((fileName) => (
                <option key={fileName} value={fileName}>
                  {fileName}
                </option>
              ))}
            </select>
          </div>
        </div>
      <button
        className="intersect-button"
        onClick={handleUnion}
        disabled={!selectedFile1 || !selectedFile2}
      >
        Perform Union
      </button>

      <div className="intersect-item5">
          <div className="item">
            <label htmlFor="customLayerNameInput">Custom Layer Name:</label>
          </div>
          <div className="item">
            <input
              id="customLayerNameInput"
              type="text"
              value={customLayerName}
              onChange={handleCustomLayerNameChange}
            />
          </div>
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
