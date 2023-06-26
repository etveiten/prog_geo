import React, { createContext, useState } from "react";

// Create the MapContext
export const MapContext = createContext();


export const MapProvider = ({ children }) => {
  const [basemapOpacity, setBasemapOpacity] = useState(1);
  const [basemapProjection, setBasemapProjection] = useState("web-mercator");

  return (
    <MapContext.Provider
      value={{
        basemapOpacity,
        setBasemapOpacity,
        basemapProjection,
        setBasemapProjection,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
