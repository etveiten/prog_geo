import "./App.css";
import Map from "./Components/Map/Map";
import Sidebar from "./Components/Sidebar/Sidebar";
import { useState } from "react";

// Contexts
import { MapProvider } from "./Components/Map/MapContext";
import { MapSettingsProvider } from "./Components/Sidebar/MapSettings/MapSettingsContext";
import { LayersProvider } from "./Components/Sidebar/Layers/LayersContext"; // Updated import

//Add icons
import {ReactComponent as ToolsIcon} from "./Icons/tools-svgrepo-com.svg";

function App() {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false);
  const [isToolsFolded, setIsToolsFolded] = useState(true);

  const handleToolsFoldButtonClick = () => {
    setIsToolsFolded(!isToolsFolded);
  };


  return (
    <MapProvider>
      <MapSettingsProvider>
        <LayersProvider>
          <div className="App">
            <div
              className="sidebar-container"
            >
              <Sidebar />
            </div>
            <div className="map-container">
              <Map />
            </div>
            <div className={`tools-container ${isToolsFolded ? "folded" : ""}`}>
              <button
                className={`fold-button tools-button ${
                  isToolsFolded ? "folded" : ""
                }`}
                onClick={handleToolsFoldButtonClick}
              >
                <span className="icon">
                <ToolsIcon className="tools-icon" />
                </span>
              </button>
              {/* Add your content for the tools container here */}
            </div>
          </div>
        </LayersProvider>
      </MapSettingsProvider>
    </MapProvider>
  );
}

export default App;
