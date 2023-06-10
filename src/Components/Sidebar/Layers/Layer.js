import React, { useEffect } from "react";
import { loadModules } from "esri-loader";

const Layer = ({ url }) => {
  useEffect(() => {
    loadModules(["esri/layers/GeoJSONLayer"]).then(([GeoJSONLayer]) => {
      const layer = new GeoJSONLayer({
        url: url,
      });

      return layer;
    });
  }, []);

  return null; // This component doesn't render anything directly
};

export default Layer;
