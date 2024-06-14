import React, { createContext, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

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
  updateLayerName: () => {},
  selectedTool: null, // 'color' or 'opacity'
  selectedLayerForTool: null, // Name of the layer for which the tool is selected
  setSelectedTool: () => {},
  setSelectedLayerForTool: () => {},
  selectedLayerDetails: null,
  setSelectedLayerDetails: () => {},
});

export const LayersProvider = ({ children }) => {
  const [layerComponents, setLayerComponents] = useState([]);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [removedLayers, setRemovedLayers] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedLayerForTool, setSelectedLayerForTool] = useState(null);
  const [selectedLayerDetails, setSelectedLayerDetails] = useState(null);

  const { update, getByIndex } = useIndexedDB("files");

  //Add layers, update the selected layers. Add the new layer to the back of the array

  const addLayer = (layer) => {
    if (!layerComponents.some((l) => l.name === layer.name)) {
      setLayerComponents((prevComponents) => [
        { ...layer, isVisible: true },
        ...prevComponents,
      ]);
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

  // Function to toggle layer visibility

  const toggleLayerVisibility = (layerName) => {
    setLayerComponents((prevComponents) =>
      prevComponents.map((layer) =>
        layer.name === layerName
          ? { ...layer, isVisible: !layer.isVisible }
          : layer
      )
    );
  };

  //Reorder the layer so that you can change the order of the layers in the datalist
  const reorderLayers = (startIndex, endIndex) => {
    setLayerComponents((prevComponents) => {
      const result = Array.from(prevComponents);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
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

  const updateLayerName = async (layerId, newName) => {
    // Update layerComponents array in the context
    setLayerComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.name === layerId
          ? { ...component, layerName: newName }
          : component
      )
    );

    // Update the layerName in IndexedDB
    const fileData = await getByIndex("name", layerId);
    if (fileData) {
      await update({ ...fileData, layerName: newName });
    }
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
        updateLayerName,
        toggleLayerVisibility,
        selectedTool,
        setSelectedTool,
        selectedLayerForTool,
        setSelectedLayerForTool,
        selectedLayerDetails,
        setSelectedLayerDetails,
      }}
    >
      {children}
    </LayersContext.Provider>
  );
};
