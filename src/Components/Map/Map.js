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

  const {
    layerComponents,
    removedLayers,
    setLayerComponents,
    clearRemovedLayers,
    setLayerColor,
    layerStyles,
  } = useContext(LayersContext);
  const [removeLayerCounter, setRemoveLayerCounter] = useState(0);
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

  //renderer test

  useEffect(() => {
    loadModules(["esri/layers/GeoJSONLayer", "esri/request"]).then(
      ([GeoJSONLayer, esriRequest]) => {
        // Check the current layers on the map, and if the current layer is no longer in the layerComponents array, delete the layer
        mapLayersRef.current.forEach((layer) => {
          if (!layerComponents.includes(layer.name)) {
            mapView.map.remove(layer);
          }
        });

        // Check the layer components array, and if there is a new layer in the list - add the new layer to the map
        // Slice and reverse the list so the last element added to the list is rendered first, hence this layer will be on the bottom
        layerComponents
          .slice()
          .reverse()
          .forEach((layer) => {
            if (
              !mapLayersRef.current.find((layers) => layers.name === layer.name)
            ) {
              esriRequest(layer.url, {
                responseType: "json",
              }).then(function (response) {
                const layerType = response.data.features[0].geometry.type;
                console.log(layerType);

                let renderer;
                let symbol;

                if (layerType === "Point") {
                  renderer = {
                    type: "simple",
                    symbol: {
                      type: "simple-marker",
                      color: layer.color,
                      outline: {
                        color: layer.outlineColor,
                        width: 1,
                      },
                    },
                  };
                } else if (
                  layerType === "Polyline" ||
                  layerType === "LineString"
                ) {
                  renderer = {
                    type: "simple",
                    symbol: {
                      type: "simple-line",
                      color: layer.color,
                      width: 1,
                    },
                  };
                } else if (layerType === "Polygon" || "MultiPolygon") {
                  renderer = {
                    type: "simple",
                    symbol: {
                      type: "simple-fill",
                      color: layer.color,
                      outline: {
                        color: layer.outlineColor,
                        width: 1,
                      },
                    },
                  };
                }

                const newLayer = new GeoJSONLayer({
                  url: layer.url,
                  renderer: renderer,
                });

                newLayer.opacity = layer.opacity;
                mapView.map.add(newLayer);
                mapLayersRef.current.push(newLayer);
              });
            }
          });
      }
    );

    console.log(layerComponents);
  }, [layerComponents]);

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
