import React, { createContext, useState } from "react";

export const LayersContext = createContext();

export const LayersProvider = ({ children }) => {
  const [selectedLayers, setSelectedLayers] = useState([]); // Initialize selectedLayers as an empty array

  //Add layer the list of selectedLayers
  const addLayer = (layerName) => {
    setSelectedLayers((prevLayers) => [...prevLayers, layerName]);
  };

  //Remove layer from the list of selectedLayers
  const removeLayer = (layerName) => {
    setSelectedLayers((prevLayers) =>
      prevLayers.filter((layer) => layer !== layerName)
    );
  };

  //Remove all layers from the list of selectedLayers
  const removeAllLayers = () => {
    setSelectedLayers([]);
  };

  return (
    <LayersContext.Provider
      value={{ selectedLayers, addLayer, removeLayer, removeAllLayers }}
    >
      {children}
    </LayersContext.Provider>
  );
};
