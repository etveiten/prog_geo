import React, { createContext, useState } from "react";
export const LayersContext = createContext({
  selectedLayers: [], // Set an initial value
  addLayer: () => {},
  removeLayer: () => {},
  setLayerColor: () => {},
  layerComponents: [],
  setLayerComponents: () => {},
  removedLayers: [],
  clearRemovedLayers: () => {},
});

export const LayersProvider = ({ children }) => {
  const [layerComponents, setLayerComponents] = useState([]);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [removedLayers, setRemovedLayers] = useState([]);

  const addLayer = (layer) => {
    if (!layerComponents.some((l) => l.name === layer.name)) {
      setLayerComponents((prevComponents) => [layer, ...prevComponents]);
    }
    setSelectedLayers((prevLayers) => [...prevLayers, layer.name]);
  };

  const removeLayer = (layerName) => {
    setLayerComponents((prevComponents) =>
      prevComponents.filter((component) => component.name !== layerName)
    );
    setSelectedLayers((prevLayers) =>
      prevLayers.filter((layer) => layer !== layerName)
    );
    setRemovedLayers((prevRemovedLayers) => [...prevRemovedLayers, layerName]);
    console.log("layer removed" + layerName.toString());
  };

  const reorderLayers = (startIndex, endIndex) => {
    setLayerComponents((prevComponents) => {
      const components = [...prevComponents];
      const [removed] = components.splice(startIndex, 1);
      components.splice(endIndex, 0, removed);
      return components;
    });
  };

  const removeAllLayers = () => {
    setLayerComponents([]);
  };

  const setLayerColor = (layerName, color) => {
    setLayerComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.name === layerName
          ? { ...component, color: color }
          : component
      )
    );
  };

  const setLayerComponentsWrapper = (components) => {
    setLayerComponents(components);
  };

  const clearRemovedLayers = () => {
    setRemovedLayers([]);
  };

  return (
    <LayersContext.Provider
      value={{
        layerComponents,
        addLayer,
        removeLayer,
        reorderLayers,
        removeAllLayers,
        setLayerColor,
        setLayerComponents: setLayerComponentsWrapper,
        removedLayers,
        clearRemovedLayers,
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};
