import React, { useContext, useState } from "react";
import { LayersContext } from "./LayersContext";

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
  };

  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setTempOpacity(newOpacity);
  };

  const handleUpdateOpacity = () => {
    onOpacityChange(name, tempOpacity);
  };

  const handleUpdateColor = () => {
    onColorChange(name, tempColor);
  };

  return (
    <div>
      <span>{name}</span>
      <input
        type="color"
        value={tempColor}
        onChange={(e) => setTempColor(e.target.value)}
        onMouseUp={handleUpdateColor}
      />
      <button onClick={handleRemoveLayer}>RM</button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={tempOpacity}
        onChange={handleOpacityChange}
        onMouseUp={handleUpdateOpacity}
      />
    </div>
  );
};

export default Layer;
