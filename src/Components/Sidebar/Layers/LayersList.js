import React, { useContext, useState } from "react";
import { LayersContext } from "./LayersContext";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";
import Layer from "./Layer";
import "./LayersList.css";

const LayersList = () => {
  const { reorderLayers, setLayerColor, setLayerOpacity, layerComponents } =
    useContext(LayersContext);

  const handleDragEnd = (result) => {
    if (!result.destination) return; // No valid drop destination

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    reorderLayers(startIndex, endIndex);
  };

  const handleColorChange = (layerName, newColor) => {
    setLayerColor(layerName, newColor);
  };

  const handleOpacityChange = (layerName, newOpacity) => {
    setLayerOpacity(layerName, newOpacity);
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId="layers-list" className="layers-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="layers-list-container"
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
                    >
                      <Layer
                        name={layer.name}
                        color={layer.color}
                        outlineColor={layer.outlineColor}
                        opacity={layer.opacity}
                        onColorChange={handleColorChange}
                        onOpacityChange={handleOpacityChange}
                      />
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
