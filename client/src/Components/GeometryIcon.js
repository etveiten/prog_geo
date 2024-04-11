import React from 'react';
import { ReactComponent as PointIcon } from "../Icons/points_svg2.svg"
import { ReactComponent as LineStringIcon } from "../Icons/line_icon2.svg";
import { ReactComponent as PolygonIcon } from "../Icons/polygon_icon4.svg";

const GeometryIcon = ({ type, width = "20px", height = "20px" }) => {
  switch (type) {
    case "Point":
      return <PointIcon width={width} height={height} />;
    case "MultiPoint":
        return <PointIcon width={width} height={height} />;
    case "LineString":
      return <LineStringIcon width={width} height={height} />;
    case "Polygon":
      return <PolygonIcon width={width} height={height} />;
    case "MultiPolygon":
      return <PolygonIcon width={width} height={height} />;
    // Add cases for other geometry types as needed
    default:
      return null; // or a default icon if you have one
  }
};

export default GeometryIcon;
