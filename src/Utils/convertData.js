import reproject from "reproject";
import { polygon, multiPolygon,  } from '@turf/turf';

//Old file used to convert GeoJSON data to Web Mercator projection but not needed anymore
export function convertGeoJSON(filePath) {
  // Read in the GeoJSON file
  const geojson = require(filePath);

  // Define the current projection of the GeoJSON data
  const fromProj = geojson.crs.properties.name;

  // Define the desired projection (Web Mercator)
  const toProj = "EPSG:3857";

  // Convert the GeoJSON data to the desired projection
  const converted = reproject.reproject(geojson, fromProj, toProj);

  return converted;
}


//Method of converting FeatureCollection to Polygon for easier use with turf.js
export const convertToPolygon = (geojson) => {
  let geometry = geojson.geometry;
  let polygons = [];

  if (!geometry && geojson.features && geojson.features.length > 0) {
    geojson.features.forEach((feature) => {
      if (feature.geometry.type === 'Polygon') {
        polygons.push(feature.geometry.coordinates);
      } else if (feature.geometry.type === 'MultiPolygon') {
        polygons.push(...feature.geometry.coordinates);
      } else if (feature.geometry.type === 'LineString') {
        const polygonCoords = [feature.geometry.coordinates];
        polygons.push(polygonCoords);
      }
    });
  } else if (geometry) {
    const { type, coordinates } = geometry;

    if (type === 'Polygon') {
      polygons.push(coordinates);
    } else if (type === 'MultiPolygon') {
      polygons.push(...coordinates);
    } else if (type === 'LineString') {
      const polygonCoords = [coordinates];
      polygons.push(polygonCoords);
    }
  }

  if (polygons.length === 1) {
    return polygon(polygons[0]);
  } else if (polygons.length > 1) {
    return multiPolygon(polygons);
  }

  return null;
};
