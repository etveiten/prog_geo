import "./App.css";
import Map from "./Components/Map/Map";
import Sidebar from "./Components/Sidebar/Sidebar";
import Toolbar from "./Components/Toolbar/Toolbar";
import { useState } from "react";

// Contexts
import { MapProvider } from "./Components/Map/MapContext";
import { MapSettingsProvider } from "./Components/Sidebar/MapSettings/MapSettingsContext";
import { LayersProvider } from "./Components/Sidebar/Layers/LayersContext"; // Updated import

//Add icons
import { ReactComponent as ToolsIcon } from "./Icons/tools-svgrepo-com.svg";

//Test
import MapBox from "./Components/Map/MapBox";

function App() {
  const [isToolsFolded, setIsToolsFolded] = useState(true);
  const [currentComponent, setCurrentComponent] = useState(null);

  const handleToolsFoldButtonClick = () => {
    setIsToolsFolded(!isToolsFolded);
  };

  const handleToolComponentClick = (component) => {
    setCurrentComponent(component);
  };

  return (
    <MapProvider>
      <MapSettingsProvider>
        <LayersProvider>
          <div className="App">
            <div className="sidebar-container">
              <Sidebar />
            </div>
            <div className="map-container">
              {/*
             <Map/>
             */}
              <MapBox/>
            </div>
            <div className={`tools-container ${isToolsFolded ? "folded" : ""}`}>
              <Toolbar
                isToolsFolded={isToolsFolded}
                handleFoldButtonClick={handleToolsFoldButtonClick}
                handleComponentButtonClick={handleToolComponentClick}
              />
            </div>
          </div>
        </LayersProvider>
      </MapSettingsProvider>
    </MapProvider>
  );
}

export default App;
