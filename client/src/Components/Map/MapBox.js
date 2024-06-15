import React, { useState, useEffect, useContext, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { LayersContext } from "../Sidebar/Layers/LayersContext";

function MapBox() {
  //Local states, refs and contexts to use the context functionallity
  const [map, setMap] = useState(null);
  const [addedLayers, setAddedLayers] = useState([]);
  const {
    layerComponents,
    setLayerColor,
    setLayerOpacity,
    setSelectedLayerDetails,
  } = useContext(LayersContext);
  const [layerOrder, setLayerOrder] = useState([]);
  const prevLayerOrder = useRef([]);
  const layerMap = useRef(new Map());

  //Initial loading of the map
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZXJsZW5kdHZlaXRlbiIsImEiOiJjbGo5ejRxaDgwM2xpM3FxaDUydHVwdWdmIn0.1CCqGu2G9aYvV3AgtptDZQ";
    const mapInstance = new mapboxgl.Map({
      container: "mapViewDiv",
      style: "mapbox://styles/mapbox/streets-v12",

      center: [8, 50],
      zoom: 2,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, // Use your Mapbox access token
      mapboxgl: mapboxgl,
      marker: false, // Disable the default marker
      placeholder: "Search for places", // Customize the input placeholder
    });

    mapInstance.addControl(geocoder);

    setMap(mapInstance);

    // Clean up
    return () => {
      mapInstance.remove();
    };
  }, []);

  //Main method for rendering/updating/removing layers from the map. Its is somewhat
  //Hard to understand, but it has to do with preventing too many rerenders when updating colors in "real-time"
  // useEffect(() => {
  //   //If there is no map, return
  //   if (!map) return;

  //   map.on("click", (e) => {
  //     const features = map.queryRenderedFeatures(e.point);

  //     if (features.length > 0) {
  //       // Assuming you want to show details of the first feature
  //       const feature = features[0];
  //       const featureInfo = {
  //         properties: feature.properties, // Capture the properties of the feature
  //         layerId: feature.layer.id, // The ID of the layer to which the feature belongs
  //         // Include other details as necessary
  //       };

  //       // Use setSelectedLayerDetails to update the context
  //       setSelectedLayerDetails(featureInfo);
  //     }
  //   });

  //   // Update layer order
  //   const newLayerOrder = layerComponents.map((layer) => layer.name);
  //   setLayerOrder(newLayerOrder);

  //   // Check if layer order has changed
  //   if (
  //     JSON.stringify(prevLayerOrder.current) !== JSON.stringify(newLayerOrder)
  //   ) {
  //     // Remove all layers and sources from the map if the layer order has changed since last render (or if it's the first render)
  //     addedLayers.forEach((layerId) => {
  //       if (map.getLayer(layerId)) {
  //         map.removeLayer(layerId);
  //       }
  //       if (map.getSource(layerId)) {
  //         map.removeSource(layerId);
  //       }
  //     });
  //     // Reset the added layers array
  //     setAddedLayers([]);

  //     //Go through the layerComponents that holds all layers that wants to be added to the map
  //     layerComponents
  //       .slice()
  //       .reverse()
  //       .forEach((layer) => {
  //         map.addSource(layer.name, {
  //           type: "geojson",
  //           data: layer.url,
  //         });

  //         // Determine layer type
  //         let layerType = "fill";
  //         let paintProperties = {
  //           "fill-color": layer.color,
  //           "fill-opacity": layer.opacity,
  //         };

  //         if (layer.type === "LineString") {
  //           layerType = "line";
  //           paintProperties = {
  //             "line-color": layer.color,
  //             "line-opacity": layer.opacity,
  //             "line-width": 2,
  //           };
  //         } else if (layer.type === "Point" || layer.type === "MultiPoint") {
  //           layerType = "circle";
  //           paintProperties = {
  //             "circle-color": layer.color,
  //             "circle-radius": 6,
  //           };
  //         } else if (
  //           layer.type === "Polygon" ||
  //           layer.type === "MutliPolygon"
  //         ) {
  //           // Check for polygons
  //           layerType = "fill";
  //           paintProperties = {
  //             "fill-color": layer.color,
  //             "fill-opacity": layer.opacity,
  //             "fill-outline-color": "black", // Polygon outline color
  //           };
  //         }

  //         const layerVisibility = layer.isVisible ? "visible" : "none";

  //         // Add the layer to the map
  //         map.addLayer({
  //           id: layer.name,
  //           type: layerType,
  //           source: layer.name,
  //           paint: paintProperties,
  //           layout: {visibility: layerVisibility},
  //         });

  //         //Update the added layers array
  //         setAddedLayers((prevAddedLayers) => [...prevAddedLayers, layer.name]);
  //       });

  //     // Update the previous layer order
  //     prevLayerOrder.current = newLayerOrder;
  //   } else {
  //     // Check for added or updated layers
  //     layerComponents.forEach((layer) => {
  //       const layerVisibility = layer.isVisible ? "visible" : "none";

  //       if (!addedLayers.includes(layer.name)) {
  //         map.addSource(layer.name, {
  //           type: "geojson",
  //           data: layer.url,
  //         });

  //         //Same as above
  //         let layerType = "fill";
  //         let paintProperties = {
  //           "fill-color": layer.color,
  //           "fill-opacity": layer.opacity,
  //         };

  //         if (layer.type === "LineString") {
  //           layerType = "line";
  //           paintProperties = {
  //             "line-color": layer.color,
  //             "line-opacity": layer.opacity,
  //             "line-width": 2,
  //           };
  //         }

  //         map.addLayer({
  //           id: layer.name,
  //           type: layerType,
  //           source: layer.name,
  //           layout: {visibility: layerVisibility},
  //           paint: paintProperties,
  //         });

  //         setAddedLayers((prevAddedLayers) => [...prevAddedLayers, layer.name]);
  //       } else {

  //         if (layer.type === "LineString") {
  //           map.setPaintProperty(layer.name, "line-color", layer.color);
  //           map.setPaintProperty(layer.name, "line-opacity", layer.opacity);
  //         } else if (layer.type === "Polygon" || layer.type === "MultiPolygon") {
  //           map.setPaintProperty(layer.name, "fill-color", layer.color);
  //           map.setPaintProperty(layer.name, "fill-opacity", layer.opacity);
  //         } else if (layer.type === "Point" || layer.type === "MultiPoint") {
  //           map.setPaintProperty(layer.name, "circle-color", layer.color);
  //         }
  //         // Update paint properties
  //         map.setPaintProperty(layer.name, "fill-color", layer.color);
  //         map.setPaintProperty(layer.name, "fill-opacity", layer.opacity);

  //         // Update layout properties (like visibility)
  //         map.setLayoutProperty(
  //           layer.name,
  //           "visibility",
  //           layer.isVisible ? "visible" : "none"
  //         );
  //       }
  //     });
  //   }
  // }, [map, layerComponents]);

  useEffect(() => {
    if (!map) return;

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point);

      if (features.length > 0) {
        const feature = features[0];
        const featureInfo = {
          properties: feature.properties,
          layerId: feature.layer.id,
        };

        setSelectedLayerDetails(featureInfo);
      }
    });

    const newLayerOrder = layerComponents.map((layer) => layer.name);
    setLayerOrder(newLayerOrder);

    if (
      JSON.stringify(prevLayerOrder.current) !== JSON.stringify(newLayerOrder)
    ) {
      addedLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(layerId)) {
          map.removeSource(layerId);
        }
      });
      setAddedLayers([]);

      layerComponents
        .slice()
        .reverse()
        .forEach((layer) => {
          map.addSource(layer.name, {
            type: "geojson",
            data: layer.url,
          });

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

          map.addLayer({
            id: layer.name,
            type: layerType,
            source: layer.name,
            layout: { visibility: layerVisibility },
            paint: paintProperties,
          });

          setAddedLayers((prevAddedLayers) => [...prevAddedLayers, layer.name]);
        });

      prevLayerOrder.current = newLayerOrder;
    } else {
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
          } else if (layer.type === "Polygon" || layer.type === "MutliPolygon") {
            layerType = "fill";
            paintProperties = {
              "fill-color": layer.color,
              "fill-opacity": layer.opacity,
              "fill-outline-color": "black",
            };
          }

          map.addLayer({
            id: layer.name,
            type: layerType,
            source: layer.name,
            layout: { visibility: layerVisibility },
            paint: paintProperties,
          });

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
  }, [map, layerComponents]);


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
