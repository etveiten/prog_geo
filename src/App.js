import "./App.css";
import Map from "./Components/Map/Map";
import Sidebar from "./Components/Sidebar/Sidebar";

// Contexts
import { MapProvider } from "./Components/Map/MapContext";
import { MapSettingsProvider } from "./Components/Sidebar/MapSettings/MapSettingsContext";
import { LayersProvider } from "./Components/Sidebar/Layers/LayersContext"; // Updated import

function App() {
  return (
    <MapProvider>
      <MapSettingsProvider>
        <LayersProvider>
          <div className="App">
            <div className="sidebar-container">
              <Sidebar />
            </div>
            <div className="map-container">
              <Map />
            </div>
          </div>
        </LayersProvider>
      </MapSettingsProvider>
    </MapProvider>
  );
}

export default App;
