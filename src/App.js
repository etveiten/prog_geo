import "./App.css";
import Map from "./Map/Map";

function App() {
  return (
    <div className="App">
      <div className="sidebar-container"></div>
      <div className="map-container">
        <Map />
      </div>
    </div>
  );
}

export default App;
