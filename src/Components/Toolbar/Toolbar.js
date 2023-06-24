import "./Toolbar.css";
import { ReactComponent as FoldIcon } from "../../Icons/fold-down-svgrepo-com.svg";
import { ReactComponent as BufferIcon } from "../../Icons/buffer-svgrepo-com.svg";
import { ReactComponent as DifferenceIcon } from "../../Icons/difference-svgrepo-com.svg";
import { ReactComponent as IntersectIcon } from "../../Icons/intersect-svgrepo-com.svg";
import { ReactComponent as UnionIcon } from "../../Icons/union-svgrepo-com.svg";
import { ReactComponent as ToolsIcon } from "../../Icons/tools-svgrepo-com.svg";
import { ReactComponent as InfoIcon } from "../../Icons/info-filled-svgrepo-com.svg";
import { useEffect, useState } from "react";

import Buffer from "./Buffer";
import Difference from "./Difference";
import Union from "./Union";
import Intersect from "./Intersect";

// MUI
import { Alert, IconButton } from "@mui/material";
import Info from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

import {
  bufferInfoMessage,
  differenceInfoMessage,
  intersectInfoMessage,
  unionInfoMessage,
  toolsInfoMessage,
} from "../../Utils/InfoMessages.js";

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
        {!isToolsFolded && activeComponent ? (
          activeComponent
        ) : (
          <>
            <div className="component-block">
              {!isToolsFolded && (
                <div className="title-info">
                  <div className="component-title">Buffer</div>
                  <IconButton
                    onClick={() => handleInfoClick(bufferInfoMessage)}
                  >
                    <InfoIcon className="info-icon" />
                  </IconButton>
                </div>
              )}
              <div className="icon-button">
                <button
                  className="component-button tools-button"
                  onClick={() => handleComponentButtonClick(<Buffer />)}
                >
                  <span className="icon">
                    <BufferIcon className="tools-icon" />
                  </span>
                </button>
              </div>
            </div>

            <div className="component-block">
              {!isToolsFolded && (
                <div className="title-info">
                  <div className="component-title">Difference</div>
                  <IconButton
                    onClick={() => handleInfoClick(differenceInfoMessage)}
                  >
                    <InfoIcon className="info-icon" />
                  </IconButton>
                </div>
              )}
              <div className="icon-button">
                <button
                  className="component-button tools-button"
                  onClick={() => handleComponentButtonClick(<Difference />)}
                >
                  <span className="icon">
                    <DifferenceIcon className="tools-icon" />
                  </span>
                </button>
              </div>
            </div>

            <div className="component-block">
              {!isToolsFolded && (
                <div className="title-info">
                  <div className="component-title">Intersect</div>
                  <IconButton
                    onClick={() => handleInfoClick(intersectInfoMessage)}
                  >
                    <InfoIcon className="info-icon" />
                  </IconButton>
                </div>
              )}
              <div className="icon-button">
                <button
                  className="component-button tools-button"
                  onClick={() => handleComponentButtonClick(<Intersect />)}
                >
                  <span className="icon">
                    <IntersectIcon className="tools-icon" />
                  </span>
                </button>
              </div>
            </div>

            <div className="component-block">
              {!isToolsFolded && (
                <div className="title-info">
                  <div className="component-title">Union</div>
                  <IconButton onClick={() => handleInfoClick(unionInfoMessage)}>
                    <InfoIcon className="info-icon" />
                  </IconButton>
                </div>
              )}
              <div className="icon-button">
                <button
                  className="component-button tools-button"
                  onClick={() => handleComponentButtonClick(<Union />)}
                >
                  <span className="icon">
                    <UnionIcon className="tools-icon" />
                  </span>
                </button>
              </div>
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
