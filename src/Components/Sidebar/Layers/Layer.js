import React, { useContext } from "react";
import "./Layer.css";
import { LayersContext } from "./LayersContext";


//MUI
import { IconButton } from "@mui/material";

//A layer is just holding the name that can be used as id

const Layer = ({ name, color, onColorChange }) => {
  const { removeLayer, setLayerColor } = useContext(LayersContext);

  const handleRemoveLayer = () => {
    removeLayer(name);
  };

  const handleColorChange = (newColor) => {
    onColorChange(name, newColor);
  };

  return (
    <div className="layer-container">
      <span>{name}</span>
    </div>
  );
};

export default Layer;
