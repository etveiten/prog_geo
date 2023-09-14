import React, { createContext, useState } from "react";

export const LayersContext = createContext({
  selectedLayers: [], // Set an initial value
  addLayer: () => {},
  removeLayer: () => {},
  setLayerColor: () => {},
  setLayerOpacity: () => {},
  layerComponents: [],
  setLayerComponents: () => {},
  removedLayers: [],
  clearRemovedLayers: () => {},
});

export const LayersProvider = ({ children }) => {
  const [layerComponents, setLayerComponents] = useState([]);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [removedLayers, setRemovedLayers] = useState([]);

  //Add layers, update the selected layers. Add the new layer to the back of the array

  const addLayer = (layer) => {
    if (!layerComponents.some((l) => l.name === layer.name)) {
      setLayerComponents((prevComponents) => [layer, ...prevComponents]);
    }
    setSelectedLayers((prevLayers) => [...prevLayers, layer.name]);
  };

  //The oposite of add layer
  const removeLayer = (layerName) => {
    setLayerComponents((prevComponents) =>
      prevComponents.filter((component) => component.name !== layerName)
    );
    setSelectedLayers((prevLayers) =>
      prevLayers.filter((layer) => layer !== layerName)
    );
    setRemovedLayers((prevRemovedLayers) => [...prevRemovedLayers, layerName]);
    
  };

  //Reorder the layer so that you can change the order of the layers in the datalist 
  const reorderLayers = (startIndex, endIndex) => {
    setLayerComponents((prevComponents) => {
      const components = [...prevComponents];
      const [removed] = components.splice(startIndex, 1);
      components.splice(endIndex, 0, removed);
      return components;
    });
  };

  //Remove all layers
  const removeAllLayers = () => {
    setLayerComponents([]);
  };

  //Color handler
  const setLayerColor = (layerName, color) => {
    setLayerComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.name === layerName ? { ...component, color } : component
      )
    );
  };

  //Opacity handler
  const setLayerOpacity = (layerName, opacity) => {
    setLayerComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.name === layerName ? { ...component, opacity } : component
      )
    );
  };

  //React spesific, but makes it so you can access the setLayerComponents function from outside the context
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
        setLayerOpacity,
        clearRemovedLayers,
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};
