import "./Toolbar.css";
import { ReactComponent as FoldIcon } from "../../Icons/fold-down-svgrepo-com.svg";
import { useEffect, useState } from "react";

import Buffer from "./Buffer";
import Difference from "./Difference";
import Union from "./Union";
import Intersect from "./Intersect";

import { ReactComponent as ToolsIcon } from "../../Icons/tools-svgrepo-com.svg";


// MUI
import { Alert, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

import {
  bufferInfoMessage,
  differenceInfoMessage,
  intersectInfoMessage,
  unionInfoMessage,
  toolsInfoMessage,
} from "../../Utils/InfoMessages.js";

//Toolbar that holds the geomspatial tools

function Toolbar({ isToolsFolded, handleFoldButtonClick }) {
  const [activeComponent, setActiveComponent] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");

  const handleComponentButtonClick = (component) => {
    setActiveComponent(component);
  };

  const handleInfoClick = (message) => {
    setInfoMessage(message);
  };

  const handleInfoClose = () => {
    setInfoMessage("");
  };

  return (
    <div className={`toolbar-container ${isToolsFolded ? "folded" : ""}`}>
      <div className="toolbar-header">
        <button
          className={`component-button tools-button ${
            isToolsFolded ? "folded" : ""
          }`}
          onClick={handleFoldButtonClick}
          id="fold-button"
        >
          <FoldIcon
            className={`tools-icon ${!isToolsFolded ? "folded" : ""}`}
            id="fold-icon"
          />
        </button>
        {!isToolsFolded && (
          <IconButton onClick={() => handleInfoClick(toolsInfoMessage)}>
            <InfoIcon className="tools-icon" />
          </IconButton>
        )}
      </div>

      <div className="toolbar-body">
        {!isToolsFolded && (
          <>
            <div className="component-block">
              <Buffer />
            </div>

            <div className="component-block">
              <Difference />
            </div>

            <div className="component-block">
              <Intersect />
            </div>

            <div className="component-block">
              <Union />
            </div>
          </>
        )}
      </div>

      <div className="tools-footer">
        {activeComponent && !isToolsFolded && (
          <button
            className="component-button tools-button"
            onClick={() => setActiveComponent(null)}
          >
            <span className="icon">
              <ToolsIcon className="tools-icon" />
            </span>
          </button>
        )}
      </div>

      {infoMessage && (
        <div className="info-container">
          <Alert
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleInfoClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {infoMessage}
          </Alert>
        </div>
      )}
    </div>
  );
}

export default Toolbar;
