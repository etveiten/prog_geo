import React, { useState, useEffect, useContext } from "react";
import { LayersContext } from "../Layers/LayersContext";

function DataList() {
  // Context methods for the Layers
  const { addLayer, removeLayer, selectedLayers } = useContext(LayersContext);
  const [dataFiles, setDataFiles] = useState([]);

  useEffect(() => {
    const importAll = (r) =>
      r.keys().map((fileName) => fileName.match(/([^/]+)\.json$/)[1]);
    const files = importAll(
      require.context("../../../Data", false, /\.(json)$/)
    );

    setDataFiles(files);
  }, []);

  const isLayerSelected = (fileName) => {
    return selectedLayers && selectedLayers.includes(fileName);
  };

  const handleAddLayer = (fileName) => {
    if (!isLayerSelected(fileName)) {
      const layerUrl = `http://127.0.0.1:8080/${fileName}.json`; // Construct the layer URL
      addLayer({ name: fileName, url: layerUrl });
    } else {
      removeLayer(fileName);
    }
  };

  return (
    <div>
      <h1>Data List</h1>
      <ul>
        {dataFiles.map((fileName) => (
          <li key={fileName}>
            {fileName}
            <button onClick={() => handleAddLayer(fileName)}>
              {isLayerSelected(fileName) ? "Remove Layer" : "Add Layer"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataList;
