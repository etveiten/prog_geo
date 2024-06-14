import React, { useContext, useState } from "react";
import { LayersContext } from "./LayersContext";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import Layer from "./Layer";
import GeometryIcon from "../../GeometryIcon";

// Color and opacity components
import { CompactPicker } from "react-color";
import OpacitySlider from "./OpacitySlider";

// Icons
import { ReactComponent as RemoveIcon } from "../../../Icons/remove-circle-svgrepo-com.svg";
import { ReactComponent as OpacityIcon } from "../../../Icons/ll_opacity.svg";
import { ReactComponent as ColorIcon } from "../../../Icons/color-palette-svgrepo-com.svg";
import { ReactComponent as VisibleIcon } from "../../../Icons/ll_visible_true.svg";
import { ReactComponent as VisibleIconFalse } from "../../../Icons/ll_visible_false.svg";

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
    updateLayerName,
    toggleLayerVisibility,
    setSelectedTool,
    setSelectedLayerForTool,
    selectedTool,
  } = useContext(LayersContext);

  // State for selected layer and tool
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [editingLayerId, setEditingLayerId] = useState(null);
  const [newLayerName, setNewLayerName] = useState("");

  
  const handleColorButtonClick = (layerName) => {
    if (selectedLayer === layerName && selectedTool === 'color') {
      // If the same layer's color picker is already open, close it
      setSelectedTool(null);
      setSelectedLayerForTool(null);
    } else {
      // Otherwise, open the color picker for this layer
      setSelectedLayer(layerName); // You may keep or remove this line based on your requirement
      setSelectedTool('color');
      setSelectedLayerForTool(layerName);
    }
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



  const handleVisibilityClick = (layerName) => {
    toggleLayerVisibility(layerName);
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

  const startEditing = (layerId, currentName) => {
    setEditingLayerId(layerId);
    setNewLayerName(currentName);
  };

  const updateNameAndStopEditing = (layerId) => {
    if (newLayerName && newLayerName !== layerId) {
      updateLayerName(layerId, newLayerName);
    }
    setEditingLayerId(null);
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
                      
                      </div>
                      <div className="layer-box">
                        <div className="layer-name-container">
                          <div
                            className="layer-color-box"
                            style={{ backgroundColor: layer.color }}
                          ></div>
                          {editingLayerId === layer.name ? (
                            <input
                              type="text"
                              value={newLayerName}
                              onChange={(e) => setNewLayerName(e.target.value)}
                              onBlur={() =>
                                updateNameAndStopEditing(layer.name)
                              }
                              onKeyPress={(e) =>
                                e.key === "Enter" &&
                                updateNameAndStopEditing(layer.name)
                              }
                              className="layer-name-input"
                            />
                          ) : (
                            
                            <span
                              className="layer-text"
                              onClick={() =>
                                startEditing(layer.name, layer.layerName)
                              }
                            >
                              {layer.layerName}
                            
                            </span>
                            
                            
                          )}
                          
                        </div>
                        <div className="geometry-icon">
                          <GeometryIcon type={layer.type} />
                        </div>

                        
                      </div>

                      <div className="layer-info">
                        <button
                          className="layer-button"
                          onClick={() => handleColorButtonClick(layer.name)}
                        >
                          <span className="layer-icon color-icon">
                            <ColorIcon width="20px" height="20px" />
                          </span>
                        </button>
                      
                        <button
                          className="layer-button"
                          onClick={() => handleVisibilityClick(layer.name)}
                        >
                          <span className="layer-icon visibility-icon">
                            {layer.isVisible ? (
                              <VisibleIcon width="20px" height="20px" />
                            ) : (
                              <VisibleIconFalse width="20px" height="20px" />
                            )}
                          </span>
                        </button>
                        <button
                          className="layer-button"
                          onClick={() => handleRemoveLayer(layer.name)}
                        >
                          <span className="layer-icon remove-icon">
                            <RemoveIcon width="20px" height="20px" />
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
