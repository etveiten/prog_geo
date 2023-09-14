import React, { useState, useEffect, useContext, useRef } from "react";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LayersContext } from "../Sidebar/Layers/LayersContext";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZXJsZW5kdHZlaXRlbiIsImEiOiJjbGo5ejRxaDgwM2xpM3FxaDUydHVwdWdmIn0.1CCqGu2G9aYvV3AgtptDZQ",
});

function MapBox() {
  // Local states and contexts to use the context functionality
  const [addedLayers, setAddedLayers] = useState([]);
  const { layerComponents } = useContext(LayersContext);
  const [layerOrder, setLayerOrder] = useState([]);
  const prevLayerOrder = useRef([]);

  // Main method for rendering/updating/removing layers from the map
  useEffect(() => {
    // Update layer order
    const newLayerOrder = layerComponents.map((layer) => layer.name);
    setLayerOrder(newLayerOrder);

    // Check if layer order has changed
    if (JSON.stringify(prevLayerOrder.current) !== JSON.stringify(newLayerOrder)) {
      // Remove all layers and sources from the map if the layer order has changed since the last render (or if it's the first render)
      addedLayers.forEach((layerId) => {
        // Remove layers by changing the key
        setAddedLayers((prevAddedLayers) =>
          prevAddedLayers.filter((id) => id !== layerId)
        );
      });

      // Go through the layerComponents that hold all layers that want to be added to the map
      layerComponents
        .slice()
        .reverse()
        .forEach((layer) => {
          // Determine layer type
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
          } else if (layer.type === "Point") {
            layerType = "circle";
            paintProperties = {
              "circle-color": layer.color,
              "circle-radius": 6,
            };
          } else if (layer.type === "Polygon") {
            // Check for polygons
            layerType = "fill";
            paintProperties = {
              "fill-color": layer.color,
              "fill-opacity": layer.opacity,
              "fill-outline-color": "black", // Polygon outline color
            };
          }

          // Add the layer to the map
          setAddedLayers((prevAddedLayers) => [
            ...prevAddedLayers,
            <Layer
              key={layer.name} // Use a unique key for each layer
              type={layerType}
              id={layer.name}
              layout={{ visibility: "visible" }}
              paint={paintProperties}
              sourceId={layer.name}
            >
              <Feature coordinates={layer.url} />
            </Layer>,
          ]);
        });

      // Update the previous layer order
      prevLayerOrder.current = newLayerOrder;
    }
  }, [layerComponents, addedLayers]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Map
        style="mapbox://styles/mapbox/streets-v12"
        containerStyle={{
          height: "100%",
          width: "100%",
          border: "none",
        }}
        center={[10.3507, 63.4095]}
        zoom={[13]}
      >
        {addedLayers}
      </Map>
    </div>
  );
}

export default MapBox;
