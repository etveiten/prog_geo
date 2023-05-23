import React, { useState, useEffect, useRef } from "react";
import { loadModules } from "esri-loader";
import { MapContext } from "./MapContext";
import "./Map.css";

const Map = () => {
  //Map context
  const { basemapOpacity, setBasemapOpacity, basemapProjection } =
    React.useContext(MapContext);
  //Local states
  const [mapView, setMapView] = useState(null);
  const basemapGalleryRef = useRef(null);

  //Add Map when page loads
  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/config",
      "esri/widgets/BasemapGallery",
      "esri/widgets/Expand",
    ]).then(([Map, MapView, esriConfig, BasemapGallery, Expand]) => {
      esriConfig.apiKey =
        "AAPKaa88b9bc82a2443abfc17d119fa2de0bbjjSaYOLrxHZmTwJP1vouhBEgG1cxrogX0vZ_0taM8X5pq8ALVy4Fraf27KFZOVx";

      //Create Map

      const map = new Map({
        basemap: "arcgis-streets-night",
      });

      //Create MapView
      const view = new MapView({
        container: "mapViewDiv",
        map: map,
        center: [10.3507, 63.4095],
        zoom: 13,
      });

      //Expandable Basemap Gallery widget
      const bgExpand = new Expand({
        view: view,
        content: new BasemapGallery({
          view: view,
          expandIconClass: "esri-icon-basemap",
        }),
      });

      view.ui.add(bgExpand, "top-right");
      view.when(() => {
        setMapView(view);
      });

      basemapGalleryRef.current = bgExpand.BasemapGallery;
      console.log(basemapGalleryRef.current);
    });
  }, []);

  //Listen to map settings changes
  useEffect(() => {
    if (
      mapView &&
      mapView.map &&
      mapView.map.basemap &&
      basemapOpacity !== null
    ) {
      mapView.map.basemap.baseLayers.forEach((layer) => {
        layer.opacity = basemapOpacity;
      });
    }
  }, [mapView, basemapOpacity]);

  //When changing basemap, resetting settings to default

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <link
        rel="stylesheet"
        href="https://js.arcgis.com/4.19/esri/themes/light/main.css"
      />
      <div
        id="mapViewDiv"
        style={{
          height: "100%",
          width: "100%",
          border: "none",
        }}
      />
    </div>
  );
};

export default Map;
