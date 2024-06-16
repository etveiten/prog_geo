import React, { useState, useEffect, useContext, useRef } from "react";
import mapboxgl from "mapbox-gl"; // Import Mapbox GL
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox GL CSS
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"; // Import Mapbox Geocoder
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"; // Import Mapbox Geocoder CSS

import { LayersContext } from "../Sidebar/Layers/LayersContext"; // Import Layers Context

function MapBox() {
  // Local states, refs, and contexts to use the context functionality
  const [map, setMap] = useState(null); // State to store the map instance
  const [addedLayers, setAddedLayers] = useState([]); // State to keep track of added layers
  const {
    layerComponents,
    setLayerColor,
    setLayerOpacity,
    setSelectedLayerDetails,
  } = useContext(LayersContext); // Use Layers Context
  const [layerOrder, setLayerOrder] = useState([]); // State to keep track of layer order
  const prevLayerOrder = useRef([]); // Ref to store previous layer order
  const layerMap = useRef(new Map()); // Ref to store layer map

  // Initial loading of the map
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZXJsZW5kdHZlaXRlbiIsImEiOiJjbGo5ejRxaDgwM2xpM3FxaDUydHVwdWdmIn0.1CCqGu2G9aYvV3AgtptDZQ"; // Set Mapbox access token
    const mapInstance = new mapboxgl.Map({
      container: "mapViewDiv", // ID of the container where the map will be rendered
      style: "mapbox://styles/mapbox/streets-v12", // Map style
      center: [8, 50], // Initial center coordinates
      zoom: 2, // Initial zoom level
    });

    // Add geocoder control to the map
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, // Use your Mapbox access token
      mapboxgl: mapboxgl,
      marker: false, // Disable the default marker
      placeholder: "Search for places", // Customize the input placeholder
    });

    mapInstance.addControl(geocoder); // Add geocoder control to the map

    setMap(mapInstance); // Set map instance in state

    // Clean up function to remove the map instance when the component is unmounted
    return () => {
      mapInstance.remove();
    };
  }, []);

  // Effect to handle layer updates
  useEffect(() => {
    if (!map) return; // If map is not initialized, return

    // Event listener for map click
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point); // Get features at the clicked point

      if (features.length > 0) {
        const feature = features[0];
        const featureInfo = {
          properties: feature.properties,
          layerId: feature.layer.id,
        };

        setSelectedLayerDetails(featureInfo); // Set selected layer details in context
      }
    });

    // Update layer order state
    const newLayerOrder = layerComponents.map((layer) => layer.name);
    setLayerOrder(newLayerOrder);

    // Check if layer order has changed
    if (
      JSON.stringify(prevLayerOrder.current) !== JSON.stringify(newLayerOrder)
    ) {
      // Remove previously added layers
      addedLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(layerId)) {
          map.removeSource(layerId);
        }
      });
      setAddedLayers([]);

      // Add layers in reverse order for proper z-index
      layerComponents
        .slice()
        .reverse()
        .forEach((layer) => {
          map.addSource(layer.name, {
            type: "geojson",
            data: layer.url,
          });

          // Define layer type and paint properties
          let layerType = "fill";
          let paintProperties = {
            "fill-color": layer.color,
            "fill-opacity": layer.opacity,
          };

          if (layer.type === "LineString") {
            layerType = "line";
            paintProperties = {
              "line-color": layer.color,
              "line-opacity": layer.opacity,
              "line-width": 2,
            };
          } else if (layer.type === "Point" || layer.type === "MultiPoint") {
            layerType = "circle";
            paintProperties = {
              "circle-color": layer.color,
              "circle-radius": 6,
            };
          } else if (layer.type === "Polygon" || layer.type === "MutliPolygon") {
            layerType = "fill";
            paintProperties = {
              "fill-color": layer.color,
              "fill-opacity": layer.opacity,
              "fill-outline-color": "black",
            };
          }

          const layerVisibility = layer.isVisible ? "visible" : "none";

          // Add layer to the map
          map.addLayer({
            id: layer.name,
            type: layerType,
            source: layer.name,
            layout: { visibility: layerVisibility },
            paint: paintProperties,
          });

          // Update added layers state
          setAddedLayers((prevAddedLayers) => [...prevAddedLayers, layer.name]);
        });

      // Update previous layer order
      prevLayerOrder.current = newLayerOrder;
    } else {
      // Update existing layers
      layerComponents.forEach((layer) => {
        const layerVisibility = layer.isVisible ? "visible" : "none";

        if (!addedLayers.includes(layer.name)) {
          map.addSource(layer.name, {
            type: "geojson",
            data: layer.url,
          });

          let layerType = "fill";
          let paintProperties = {
            "fill-color": layer.color,
            "fill-opacity": layer.opacity,
            "fill-outline-color": layer.outlineColor,
          };

          if (layer.type === "LineString") {
            layerType = "line";
            paintProperties = {
              "line-color": layer.color,
              "line-opacity": layer.opacity,
              "line-width": 2,
            };
          } else if (layer.type === "Point" || layer.type === "MultiPoint") {
            layerType = "circle";
            paintProperties = {
              "circle-color": layer.color,
              "circle-radius": 6,
            };
          } else if (layer.type === "Polygon" || layer.type === "MultiPolygon") {
            layerType = "fill";
            paintProperties = {
              "fill-color": layer.color,
              "fill-opacity": layer.opacity,
              "fill-outline-color": "black",
            };
          }

          // Add layer to the map
          map.addLayer({
            id: layer.name,
            type: layerType,
            source: layer.name,
            layout: { visibility: layerVisibility },
            paint: paintProperties,
          });

          // Update added layers state
          setAddedLayers((prevAddedLayers) => [...prevAddedLayers, layer.name]);
        } else {
          // Update paint properties based on the layer type
          if (layer.type === "LineString") {
            map.setPaintProperty(layer.name, "line-color", layer.color);
            map.setPaintProperty(layer.name, "line-opacity", layer.opacity);
          } else if (layer.type === "Polygon" || layer.type === "MultiPolygon") {
            map.setPaintProperty(layer.name, "fill-color", layer.color);
            map.setPaintProperty(layer.name, "fill-opacity", layer.opacity);
          } else if (layer.type === "Point" || layer.type === "MultiPoint") {
            map.setPaintProperty(layer.name, "circle-color", layer.color);
          }
          map.setLayoutProperty(
            layer.name,
            "visibility",
            layerVisibility
          );
        }
      });
    }
  }, [map, layerComponents]); // Depend on map and layerComponents

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div
        id="mapViewDiv"
        style={{ height: "100%", width: "100%", border: "none" }}
      />
    </div>
  );
}

export default MapBox;
