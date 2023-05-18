import React, { useState, useEffect } from "react";
import { loadModules } from "esri-loader";
import { none } from "ol/centerconstraint";

const Map = () => {
  const [mapView, setMapView] = useState(null);

  useEffect(() => {
    loadModules(["esri/Map", "esri/views/MapView", "esri/config"]).then(
      ([Map, MapView, esriConfig]) => {
        esriConfig.apiKey =
          "AAPKaa88b9bc82a2443abfc17d119fa2de0bbjjSaYOLrxHZmTwJP1vouhBEgG1cxrogX0vZ_0taM8X5pq8ALVy4Fraf27KFZOVx";
        const map = new Map({
          basemap: "arcgis-imagery-standard",
        });

        const view = new MapView({
          container: "mapViewDiv",
          map: map,
          center: [-118.805, 34.027],
          zoom: 13,
        });

        view.when(() => {
          setMapView(view);
        });
      }
    );
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <link
        rel="stylesheet"
        href="https://js.arcgis.com/4.19/esri/themes/light/main.css"
      />
      <div
        id="mapViewDiv"
        style={{ height: "100%", width: "100%", border: none }}
      />
    </div>
  );
};

export default Map;
