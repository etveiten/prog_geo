import "./App.css";
import Map from "./Map/Map";
import Sidebar from "./Components/Sidebar";
function App() {
  return (
    <div className="App">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="map-container">
        <Map />
      </div>
    </div>
  );
}

export default App;
