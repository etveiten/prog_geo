import React, { useContext, useState } from 'react';
import { LayersContext } from './LayersContext';

const Layer = ({
  name,
  color,
  outlineColor,
  opacity,
  onColorChange,
  onOpacityChange,
}) => {
  const { removeLayer, setLayerColor } = useContext(LayersContext);
  const [tempColor, setTempColor] = useState(color);
  const [tempOpacity, setTempOpacity] = useState(opacity);

  const handleRemoveLayer = () => {
    removeLayer(name);
  };

  const handleColorChange = () => {
    onColorChange(name, tempColor);
    setLayerColor(name, tempColor); // Update the layer color in LayersContext
  };

  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setTempOpacity(newOpacity);
    onOpacityChange(name, newOpacity);
  };

  return (
    <div>
      <span>{name}</span>
      <input
        type="color"
        value={tempColor}
        onChange={(e) => setTempColor(e.target.value)}
        onBlur={handleColorChange}
      />
      <button onClick={handleRemoveLayer}>Remove</button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={tempOpacity}
        onChange={handleOpacityChange}
      />
    </div>
  );
};

export default Layer;
