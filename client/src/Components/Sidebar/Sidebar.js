import React, { useState } from "react";
import DataList from "./DataHandler/DataList";
import LayersList from "./Layers/LayersList";
import "./Sidebar.css";

// Icons
import { ReactComponent as MapIcon } from "../../Icons/map-svgrepo-com.svg";
import { ReactComponent as DataIcon } from "../../Icons/files-svgrepo-com.svg";
import { ReactComponent as LayersIcon } from "../../Icons/layers-filled-svgrepo-com.svg";
import { ReactComponent as InfoIcon } from "../../Icons/info-filled-svgrepo-com.svg";

// MUI
import { Alert, IconButton } from "@mui/material";
import Info from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

// Just the sidebar in the application, first and formost an organizer for further components
function Sidebar() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);

  const handleItemClick = (itemId) => {
    if (itemId === selectedItem) {
      setSelectedItem(null); // Deselect the item if it's already selected
    } else {
      setSelectedItem(itemId);
    }
  };

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
    console.log("fold");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">GIS - made simpler</span>
      </div>
      <div className={`sidebar-options" ${selectedItem !== "data" ? "compact" : ""}`}>
        <div className="sidebar-buttons">
          <div
            className={`sidebar-option ${
              selectedItem === "data" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("data")}
          >
            <DataIcon
              className="sidebar-icon"
              onClick={toggleContentVisibility}
            />
            <span className="sidebar-sub-title">Data</span>
            <IconButton className="icon-button-visible"  onClick={handleInfoClick}>
              <InfoIcon className="sidebar-icon"></InfoIcon>
            </IconButton>
          </div>
        </div>
        {isContentVisible && (
          <div className={`sidebar-content ${selectedItem !== "data" ? "folded" : ""}`}>
            <DataList mode={"files"} />
          </div>
        )}
      </div>
      <div className="sidebar-selected-option">
        <div className="sidebar-layers-header">
          <LayersIcon className="sidebar-icon" />
          <h4>Layers</h4>
          <IconButton onClick={handleInfoClick}>
            <InfoIcon className="sidebar-icon" />
          </IconButton>
        </div>

        <LayersList />
      </div>
      {showInfo && (
        <Alert className="alert-message"
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleInfoClick}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Here are the current layers of the map. You can style each layer by
          clicking on the color palette. This will open the styling window. 
          Re-order the layers by
          dragging a layer to a new place in the list. Click the eye-icon to toggle on and off visibility of the selected layer. Click on the minus-symbol to remove the layer from the map.
        </Alert>
      )}
    </div>
  );
}

export default Sidebar;
