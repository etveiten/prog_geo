import React, { useState, useContext, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { LayersContext } from '../LayersContext'; 

function ColorPicker() {
  const { layerComponents, setLayerComponents, selectedLayerForTool } = useContext(LayersContext);
  const [color, setColor] = useState({ r: 255, g: 255, b: 255, a: 1 });

  // Function to parse a CSS RGBA color string to an RGBA object
  const parseToRgba = (colorStr) => {
    if (!colorStr) return null;
    const match = colorStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] ? parseFloat(match[4]) : 1 };
    }
    return null;
  };

  // Effect to initialize color picker with selected layer's color
  useEffect(() => {
    const selectedLayer = layerComponents.find(layer => layer.name === selectedLayerForTool);
    if (selectedLayer && selectedLayer.color) {
      const rgbaColor = parseToRgba(selectedLayer.color);
      if (rgbaColor) {
        setColor(rgbaColor);
      }
    }
  }, [selectedLayerForTool, layerComponents]);

  const handleColorChange = (color) => {
    const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    setColor(color.rgb);
    // Update the color of the selected layer in the global context
    const updatedComponents = layerComponents.map(layer => {
      if (layer.name === selectedLayerForTool) {
        return { ...layer, color: rgbaColor };
      }
      return layer;
    });
    setLayerComponents(updatedComponents);
  };

  return (
    <div>
      <SketchPicker color={color} onChangeComplete={handleColorChange} />
    </div>
  )
}

export default ColorPicker;
