import React, { useState, useEffect, useContext, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LayersContext } from "../Sidebar/Layers/LayersContext";

function MapBox() {

  //Local states, refs and contexts to use the context functionallity
  const [map, setMap] = useState(null);
  const [addedLayers, setAddedLayers] = useState([]);
  const { layerComponents } = useContext(LayersContext);
  const [layerOrder, setLayerOrder] = useState([]);
  const prevLayerOrder = useRef([]);
  const layerMap = useRef(new Map());

  //Initial loading of the map
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZXJsZW5kdHZlaXRlbiIsImEiOiJjbGo5ejRxaDgwM2xpM3FxaDUydHVwdWdmIn0.1CCqGu2G9aYvV3AgtptDZQ";
    const mapInstance = new mapboxgl.Map({
      container: "mapViewDiv",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [10.3507, 63.4095],
      zoom: 13,
    });

    setMap(mapInstance);

    // Clean up
    return () => {
      mapInstance.remove();
    };
  }, []);

  //Main method for rendering/updating/removing layers from the map. Its is somewhat
  //Hard to understand, but it has to do with preventing too many rerenders when updating colors in "real-time"
  useEffect(() => {

    //If there is no map, return
    if (!map) return;

    // Update layer order
    const newLayerOrder = layerComponents.map((layer) => layer.name);
    setLayerOrder(newLayerOrder);

    // Check if layer order has changed
    if (JSON.stringify(prevLayerOrder.current) !== JSON.stringify(newLayerOrder)) {
      // Remove all layers and sources from the map if the layer order has changed since last render (or if it's the first render) 
      addedLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(layerId)) {
          map.removeSource(layerId);
        }
      });
      // Reset the added layers array
      setAddedLayers([]);

      //Go through the layerComponents that holds all layers that wants to be added to the map
      layerComponents.slice().reverse().forEach((layer) => {
        map.addSource(layer.name, {
          type: "geojson",
          data: layer.url,
        });

        let layerType = "fill"; // Default layer type is "fill"
        let paintProperties = {
          "fill-color": layer.color,
          "fill-opacity": layer.opacity,
          "fill-outline-color": layer.outlineColor,
        };

        // Check if the layer is a LineString
        if (layer.type === "LineString") {
          layerType = "line"; // Set the layer type to "line" beacuse the layer is a LineString
          paintProperties = {
            "line-color": layer.color,
            "line-opacity": layer.opacity,
            "line-width": 2, 
          };
        }

        // Add the layer to the map
        map.addLayer({
          id: layer.name,
          type: layerType,
          source: layer.name,
          paint: paintProperties,
        });

        //Update the added layers array
        setAddedLayers((prevAddedLayers) => [...prevAddedLayers, layer.name]);
      });

      // Update the previous layer order
      prevLayerOrder.current = newLayerOrder;
    } else {
      // Check for added or updated layers
      layerComponents.forEach((layer) => {
        if (!addedLayers.includes(layer.name)) {
          map.addSource(layer.name, {
            type: "geojson",
            data: layer.url,
          });

          //Same as above
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
          }

          map.addLayer({
            id: layer.name,
            type: layerType,
            source: layer.name,
            paint: paintProperties,
          });

          setAddedLayers((prevAddedLayers) => [...prevAddedLayers, layer.name]);
        } else {
          map.removeLayer(layer.name);
          map.removeSource(layer.name);

          // Add the updated layer
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
          }

          map.addLayer({
            id: layer.name,
            type: layerType,
            source: layer.name,
            paint: paintProperties,
          });
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
