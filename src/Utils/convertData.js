import proj4 from "proj4";

// Define the source and destination projections
const sourceProjection = "EPSG:32633"; // UTM33 N
const destinationProjection = "EPSG:3857"; // Web Mercator

// Load the projection definitions
proj4.defs([
  ["EPSG:32633", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs"],
  [
    "EPSG:3857",
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
  ],
]);

// Use the transformed data to display on the map
