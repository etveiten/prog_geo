import React, { createContext, useContext, useState } from "react";
import { MapContext } from "../../Map/MapContext";

// Create the MapSettingsContext
export const MapSettingsContext = createContext();

// Create the MapSettingsProvider component
export const MapSettingsProvider = ({ children }) => {
  const {
    basemapOpacity,
    setBasemapOpacity,
    basemapProjection,
    setBasemapProjection,
  } = useContext(MapContext);

  // Implement additional state and functions for MapSettings component
  // For example, handleSliderChange function for adjusting basemap opacity

  return (
    <MapSettingsContext.Provider
      value={{
        basemapOpacity,
        setBasemapOpacity,
        basemapProjection,
        setBasemapProjection,
      }}
    >
      {children}
    </MapSettingsContext.Provider>
  );
};
