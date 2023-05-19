import reproject from "reproject";

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
