import React, { useState, useEffect } from "react";
import { loadModules } from "esri-loader";
import "./Map.css";

const Map = () => {
  const [mapView, setMapView] = useState(null);
  const [showBasemapItems, setShowBasemapItems] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState(null);

  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/GeoJSONLayer",
      "esri/config",
      "esri/widgets/BasemapGallery",
      "esri/core/watchUtils",
    ]).then(
      ([
        Map,
        MapView,
        GeoJSONLayer,
        esriConfig,
        BasemapGallery,
        watchUtils,
      ]) => {
        esriConfig.apiKey =
          "AAPKaa88b9bc82a2443abfc17d119fa2de0bbjjSaYOLrxHZmTwJP1vouhBEgG1cxrogX0vZ_0taM8X5pq8ALVy4Fraf27KFZOVx";
        const map = new Map({
          basemap: "arcgis-streets-night",
        });

        const view = new MapView({
          container: "mapViewDiv",
          map: map,
          center: [10.3507, 63.4095],
          zoom: 13,
        });

        const basemapGallery = new BasemapGallery({
          view: view,
        });

        view.ui.add(basemapGallery, {
          position: "top-right",
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
        style={{ height: "100%", width: "100%", border: "none" }}
      />
    </div>
  );
};

export default Map;
