import React, { useState } from "react";
import MapSettings from "./MapSettings/MapSettings";
import DataList from "./DataHandler/DataList";
import "./Sidebar.css";

function Sidebar() {
  const [selectedItem, setSelectedItem] = useState("map");

  const handleItemClick = (itemId) => {
    setSelectedItem(itemId);
  };

  //Here i will return the future components
  const renderSelectedContent = () => {
    switch (selectedItem) {
      case "map":
        return <MapSettings />;
      case "data":
        return <DataList />;
      case "layers":
        return <h1>Layers Content</h1>;
      case "tools":
        return <h1>Tools Content</h1>;
      case "search":
        return <h1>Search Content</h1>;
      case "tutorial":
        return <h1>Tutorial Content</h1>;
      case "about":
        return <h1>About Content</h1>;
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Your first GIS</h2>
      </div>
      <div className="sidebar-options">
        <ul className="sidebar-options-list">
          <li
            className={`sidebar-options-list-item ${
              selectedItem === "map" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("map")}
          >
            Map
          </li>
          <li
            className={`sidebar-options-list-item ${
              selectedItem === "data" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("data")}
          >
            Data
          </li>
          <li
            className={`sidebar-options-list-item ${
              selectedItem === "layers" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("layers")}
          >
            Layers
          </li>
          <li
            className={`sidebar-options-list-item ${
              selectedItem === "tools" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("tools")}
          >
            Tools
          </li>
          <li
            className={`sidebar-options-list-item ${
              selectedItem === "search" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("search")}
          >
            Search
          </li>
          <li
            className={`sidebar-options-list-item ${
              selectedItem === "tutorial" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("tutorial")}
          >
            Tutorial
          </li>
          <li
            className={`sidebar-options-list-item ${
              selectedItem === "about" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("about")}
          >
            About
          </li>
        </ul>
      </div>
      <div className="sidebar-selected-option">{renderSelectedContent()}</div>
    </div>
  );
}

export default Sidebar;
