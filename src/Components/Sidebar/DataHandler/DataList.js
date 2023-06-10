import React, { useState, useEffect, useContext } from "react";
import { LayersContext } from "../Layers/LayersContext";

function DataList() {
  //Context methods for the Layers
  const { addLayer, removeLayer, selectedLayers } = useContext(LayersContext); // Access addLayer and removeLayer functions from LayersContext
  const [dataFiles, setDataFiles] = useState([]);

  //Add the names of the files in the Data folder to the dataFiles array
  useEffect(() => {
    const importAll = (r) =>
      r.keys().map((fileName) => fileName.match(/([^/]+)\.json$/)[1]);
    const files = importAll(
      require.context("../../../Data", false, /\.(json)$/)
    );

    setDataFiles(files);
  }, []);

  //Check if a layer is selected
  const isLayerSelected = (fileName) => {
    return selectedLayers.includes(fileName);
  };

  return (
    <div>
      <h1>Data List</h1>
      <ul>
        {dataFiles.map((fileName) => (
          <li key={fileName}>
            {fileName}
            <button
              onClick={() =>
                isLayerSelected(fileName)
                  ? removeLayer(fileName)
                  : addLayer(fileName)
              }
            >
              {isLayerSelected(fileName) ? "Remove Layer" : "Add Layer"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataList;
