import React, { useContext, useEffect, useState } from "react";
import { MapSettingsContext } from "./MapSettingsContext";

const MapSettings = () => {
  const {
    basemapOpacity,
    setBasemapOpacity,
    basemapProjection,
    setBasemapProjection,
  } = useContext(MapSettingsContext);

  const [sliderValue, setSliderValue] = useState(basemapOpacity * 100);

  const handleSliderChange = (event) => {
    const opacity = event.target.value / 100;
    setBasemapOpacity(opacity);
  };

  useEffect(() => {
    console.log(basemapOpacity);
  }, [basemapOpacity]);
  return (
    // JSX code for your MapSettings component
    <div>
      <div>
        <label htmlFor="opacitySlider">Basemap Opacity:</label>
        <input
          type="range"
          id="opacitySlider"
          min="0"
          max="100"
          value={basemapOpacity * 100}
          onChange={handleSliderChange}
        />
      </div>
    </div>
  );
};

export default MapSettings;
