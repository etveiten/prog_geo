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

  useEffect(() => {
    setSliderValue(basemapOpacity * 100);
  }, [basemapOpacity]);

  const handleSliderChange = (event) => {
    const opacity = event.target.value / 100;
    setBasemapOpacity(opacity);
  };

  useEffect(() => {
    // Update the slider value when basemapOpacity changes
    setSliderValue(basemapOpacity * 100);
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
