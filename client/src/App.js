import "./App.css";

import Sidebar from "./Components/Sidebar/Sidebar";
import Toolbar from "./Components/Toolbar/Toolbar";
import Info from "./Components/Info";
import Dock from "./Components/Dock";
import { useState } from "react";

// Contexts
import { LayersProvider } from "./Components/Sidebar/Layers/LayersContext"; // Updated import

//Add icons
import { ReactComponent as ToolsIcon } from "./Icons/tools-svgrepo-com.svg";

//Test
import MapBox from "./Components/Map/MapBox";

//DB
import { DBConfig } from "./Database/DBConfig";
import { initDB } from "react-indexed-db-hook";
import Mapbox from "react-map-gl/dist/esm/mapbox/mapbox";

initDB(DBConfig);

function App() {
  //States for the app
  const [isToolsFolded, setIsToolsFolded] = useState(true);
  const [currentComponent, setCurrentComponent] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState("data");

  //Fold tools container
  const handleToolsFoldButtonClick = () => {
    setIsToolsFolded(!isToolsFolded);
  };

  const handleToolComponentClick = (component) => {
    setCurrentComponent(component);
  };

  return (
    <LayersProvider>
      <div className="App">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="map-container">
          <MapBox />
          <Info tool={selectedIcon} />
          <Dock onIconClick={setSelectedIcon} />
        </div>
      </div>
    </LayersProvider>
  );
}

export default App;
