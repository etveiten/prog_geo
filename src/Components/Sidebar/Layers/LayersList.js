import React, { useContext, useState } from "react";
import { LayersContext } from "./LayersContext";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import Layer from "./Layer";

// Color and opacity components
import { CompactPicker } from "react-color";
import OpacitySlider from "./OpacitySlider";

// Icons
import { ReactComponent as RemoveIcon } from "../../../Icons/remove-circle-svgrepo-com.svg";
import { ReactComponent as OpacityIcon } from "../../../Icons/opacity-svgrepo-com.svg";
import { ReactComponent as ColorIcon } from "../../../Icons/color-palette-svgrepo-com.svg";
// Mui
import { IconButton } from "@mui/material";

import "./LayersList.css";

const LayersList = () => {
  const {
    reorderLayers,
    setLayerComponents,
    setLayerOpacity,
    removeLayer,
    layerComponents,
  } = useContext(LayersContext);

  // State for selected layer and tool
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showOpacityPicker, setShowOpacityPicker] = useState(false);

  const handleColorButtonClick = (layerName) => {
    setSelectedLayer(layerName);
    setShowColorPicker(!showColorPicker);
    setShowOpacityPicker(false);
  };

  const handleOpacityButtonClick = (layerName) => {
    setSelectedLayer(layerName);
    setShowOpacityPicker(!showOpacityPicker);
    setShowColorPicker(false);
  };

  const handleColorChange = (color) => {
    if (selectedLayer) {
      const updatedComponents = layerComponents.map((layer) => {
        if (layer.name === selectedLayer) {
          return { ...layer, color: color.hex };
        }
        return layer;
      });
      setLayerComponents(updatedComponents);
    }
  };

  const handleOpacityChange = (value) => {
    if (selectedLayer) {
      const updatedComponents = layerComponents.map((layer) => {
        if (layer.name === selectedLayer) {
          return { ...layer, opacity: value };
        }
        return layer;
      });
      setLayerComponents(updatedComponents);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return; // No valid drop destination

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    reorderLayers(startIndex, endIndex);
  };

  const handleRemoveLayer = (layerName) => {
    removeLayer(layerName);
  };

  return (
    <div className="layer-list-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId="layers-list" className="layers-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="layers-list-wrapper"
            >
              {layerComponents.map((layer, index) => (
                <Draggable
                  key={layer.name}
                  draggableId={layer.name}
                  id={layer.name}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="layer-item"
                      
                    >
                      <div className="layer-tools">
                        {selectedLayer === layer.name && showColorPicker && (
                          <div className="color-picker-container">
                            <CompactPicker
                              color={layer.color}
                              onChange={handleColorChange}
                            />
                          </div>
                        )}
                        {selectedLayer === layer.name && showOpacityPicker && (
                          <div className="opacity-picker-container">
                            <OpacitySlider
                              value={layer.opacity}
                              onChange={handleOpacityChange}
                            />
                          </div>
                        )}
                      </div>
                      <div className="layer-name-container">
                        <span className="layer-name">{layer.name}</span>
                      </div>
                      <div className="layer-info">
                      
                        <button
                          className="layer-button"
                          onClick={() => handleColorButtonClick(layer.name)}
                        >
                          <span className="layer-icon color-icon">
                            <ColorIcon width="20px" height="20px"/>
                          </span>
                        </button>
                        <button
                          className="layer-button"
                          onClick={() => handleOpacityButtonClick(layer.name)}
                        >
                          <span className="layer-icon opacity-icon">
                            <OpacityIcon width="20px" height="20px" />
                          </span>
                        </button>
                        <button
                          className="layer-button"
                          onClick={() => handleRemoveLayer(layer.name)}
                        >
                          <span className="layer-icon remove-icon">
                            <RemoveIcon width="20px" height="20px"/>
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </div>
  );
};

export default LayersList;
