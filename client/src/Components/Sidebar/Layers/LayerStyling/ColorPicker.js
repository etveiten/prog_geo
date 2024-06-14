import React, { useState, useContext, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import { LayersContext } from '../LayersContext';

function ColorPicker() {
  const { layerComponents, setLayerComponents, selectedLayerForTool, setSelectedLayerForTool, setSelectedTool } = useContext(LayersContext);
  const [color, setColor] = useState({ r: 255, g: 255, b: 255, a: 1 });
  const pickerRef = useRef(null);

  // Function to parse a CSS RGBA color string to an RGBA object
  const parseToRgba = (colorStr) => {
    if (!colorStr) return { r: 255, g: 255, b: 255, a: 1 };
    const match = colorStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);
    if (match) {
      return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]), a: match[4] ? parseFloat(match[4]) : 1 };
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setSelectedLayerForTool(null); // Assume this also effectively hides the color picker
        setSelectedTool(null); // Uncomment and implement if such state exists
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSelectedLayerForTool, setSelectedTool]);

  // Effect to initialize color picker with selected layer's color
  useEffect(() => {
    if (!selectedLayerForTool || !layerComponents) return;

    const selectedLayer = layerComponents.find(layer => layer.name === selectedLayerForTool);
    if (selectedLayer && selectedLayer.color) {
      const rgbaColor = parseToRgba(selectedLayer.color);
      setColor(rgbaColor);
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

  if (!selectedLayerForTool || !layerComponents) return null;

  return (
    <div ref={pickerRef}>
      <SketchPicker color={color} onChangeComplete={handleColorChange} />
    </div>
  );
}

export default ColorPicker;
