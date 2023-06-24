import React, { useState, useEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LayersContext } from '../Sidebar/Layers/LayersContext';

function MapBox() {
  const [map, setMap] = useState(null);
  const [addedLayers, setAddedLayers] = useState([]);
  const { layerComponents } = useContext(LayersContext);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXJsZW5kdHZlaXRlbiIsImEiOiJjbGo5ejRxaDgwM2xpM3FxaDUydHVwdWdmIn0.1CCqGu2G9aYvV3AgtptDZQ';
    const mapInstance = new mapboxgl.Map({
      container: 'mapViewDiv',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [10.3507, 63.4095],
      zoom: 13,
    });

    setMap(mapInstance);

    // Clean up
    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    // Add or update layers
    layerComponents.forEach((layer) => {
      if (!addedLayers.includes(layer.name)) {
        map.addSource(layer.name, {
          type: 'geojson',
          data: layer.url,
        });

        map.addLayer({
          id: layer.name,
          type: 'fill',
          source: layer.name,
          paint: {
            'fill-color': layer.color,
            'fill-opacity': layer.opacity,
            'fill-outline-color': layer.outlineColor,
          },
        });

        setAddedLayers((prevAddedLayers) => [...prevAddedLayers, layer.name]);
      }
    });

    // Remove layers that are no longer in layerComponents
    const removedLayers = addedLayers.filter((layerId) => !layerComponents.find((layer) => layer.name === layerId));
    removedLayers.forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(layerId)) {
        map.removeSource(layerId);
      }
      setAddedLayers((prevAddedLayers) => prevAddedLayers.filter((layer) => layer !== layerId));
    });

    
  }, [map, layerComponents, addedLayers]);

  useEffect(() => {
    console.log(layerComponents);
  },[layerComponents]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div id="mapViewDiv" style={{ height: '100%', width: '100%', border: 'none' }} />
    </div>
  );
}

export default MapBox;

