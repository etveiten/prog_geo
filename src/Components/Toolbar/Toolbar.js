import "./Toolbar.css";
import { ReactComponent as FoldIcon } from "../../Icons/fold-down-svgrepo-com.svg";
import { ReactComponent as BufferIcon } from "../../Icons/buffer-svgrepo-com.svg";
import { ReactComponent as DifferenceIcon } from "../../Icons/difference-svgrepo-com.svg";
import { ReactComponent as IntersectIcon } from "../../Icons/intersect-svgrepo-com.svg";
import { ReactComponent as UnionIcon } from "../../Icons/union-svgrepo-com.svg";
import { ReactComponent as ToolsIcon } from "../../Icons/tools-svgrepo-com.svg";
import { useEffect, useState } from "react";

import Buffer from "./Buffer";
import Difference from "./Difference";
import Union from "./Union";
import Intersect from "./Intersect";


function Toolbar({ isToolsFolded, handleFoldButtonClick }) {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleComponentButtonClick = (component) => {
    setActiveComponent(component);
  };

  const clearActiveComponent = () => {
    setActiveComponent(null);
  };

  useEffect(() => {
    console.log("Active Component:", activeComponent);
  }, [activeComponent]);

  return (
    <div className={`toolbar-container ${isToolsFolded ? "folded" : ""}`}>
      <div className="toolbar-header">
        <button
          className={`component-button tools-button ${
            isToolsFolded ? "folded" : ""
          }`}
          onClick={handleFoldButtonClick}
        >
          <span className={`icon ${isToolsFolded ? "left" : "right"}`}>
            <FoldIcon className="tools-icon" />
          </span>
        </button>
      </div>

      <div className="toolbar-body">
        {!isToolsFolded && activeComponent ? (
          activeComponent
        ) : (
          <>
            <button
              className="component-button tools-button"
              onClick={() => handleComponentButtonClick(<Buffer />)}
            >
              <span className="icon">
                <BufferIcon className="tools-icon" />
              </span>
            </button>
            <button
              className="component-button tools-button"
              onClick={() => handleComponentButtonClick(<Difference />)}
            >
              <span className="icon">
                <DifferenceIcon className="tools-icon" />
              </span>
            </button>
            <button
              className="component-button tools-button"
              onClick={() => handleComponentButtonClick(<Intersect />)}
            >
              <span className="icon">
                <IntersectIcon className="tools-icon" />
              </span>
            </button>
            <button
              className="component-button tools-button"
              onClick={() => handleComponentButtonClick(<Union />)}
            >
              <span className="icon">
                <UnionIcon className="tools-icon" />
              </span>
            </button>
          </>
        )}
      </div>
      <div className="tools-footer">
        {activeComponent && !isToolsFolded && (
          <button className="component-button tools-button" onClick={clearActiveComponent}>
            <span className="icon">
            <ToolsIcon className="tools-icon"/>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Toolbar;
