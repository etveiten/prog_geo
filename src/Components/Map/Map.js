import React, { useState, useEffect, useRef, useContext } from "react";
import { loadModules } from "esri-loader";
import { MapContext } from "./MapContext";
import { LayersContext } from "../Sidebar/Layers/LayersContext";
import Layer from "../Sidebar/Layers/Layer";
import "./Map.css";

const Map = () => {
  //Map context
  const { basemapOpacity, setBasemapOpacity, basemapProjection } =
    React.useContext(MapContext);
  //Local states
  const [mapView, setMapView] = useState(null);
  const [basemapGallery, setBasemapGallery] = useState(null);

  const { selectedLayers } = useContext(LayersContext);
  const mapLayersRef = useRef([]);

  //Add Map when page loads
  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/config",
      "esri/widgets/BasemapGallery",
      "esri/widgets/Expand",
      "esri/layers/GeoJSONLayer",
    ]).then(
      ([Map, MapView, esriConfig, BasemapGallery, Expand, GeoJSONLayer]) => {
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
      }
    );
  }, []);

  //Listen to the selected layers, and render them when selected and remove them when deselected
  useEffect(() => {
    loadModules(["esri/layers/GeoJSONLayer"]).then(([GeoJSONLayer]) => {
      // Remove layers that are no longer in selectedLayers
      mapLayersRef.current.forEach((layer) => {
        if (!selectedLayers.includes(layer.id)) {
          mapView.map.remove(layer);
        }
      });

      // Add new layers from selectedLayers
      selectedLayers.forEach((layerName) => {
        const layerUrl = `http://127.0.0.1:8080/${layerName}.json`; // Construct the layer URL
        if (!mapLayersRef.current.find((layer) => layer.id === layerName)) {
          const layer = new GeoJSONLayer({
            url: layerUrl,
          });
          mapView.map.add(layer);
          mapLayersRef.current.push(layer);
        }
      });
    });
  }, [selectedLayers, mapView]);

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
