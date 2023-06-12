import React, { useEffect, useContext } from "react";
import { LayersContext } from "./LayersContext";

const Layer = ({ name, color, onColorChange, layerRenderer }) => {
  const { removeLayer } = useContext(LayersContext);

  const handleRemoveLayer = () => {
    removeLayer(name);
  };
  const handleColorChange = (e) => {
    // Call the onColorChange function with the new color value
    const newColor = e.target.value;
    onColorChange(name, newColor);
  };

  //Styling for the layer:

  return (
    <div>
      <span>{name}</span>
      <input type="color" value={color} />
      <button onClick={handleRemoveLayer}> Remove Layer</button>
    </div>
  );
};

export default Layer;
