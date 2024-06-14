import React from 'react';
import Buffer from "../Components/Toolbar/Buffer";
import Union from "../Components/Toolbar/Union";
import Intersect from "../Components/Toolbar/Intersect";
import Difference from "../Components/Toolbar/Difference";
import DataList from "../Components/Sidebar/DataHandler/DataList";
import Dissolve from "../Components/Toolbar/Dissolve";
import Clip from '../Components/Toolbar/Clip';
import ColorPicker from './Sidebar/Layers/LayerStyling/ColorPicker'; 
import Opacity from './Sidebar/Layers/LayerStyling/Opacity';
import InfoComponent from './InfoComponent.js';

import { useContext } from 'react';
import { LayersContext } from './Sidebar/Layers/LayersContext';


function Info({ tool }) {
  const { selectedTool, selectedLayerForTool } = useContext(LayersContext);

  const renderToolComponent = () => {
    // Check if color or opacity tool is selected
    if (selectedTool === 'color' && selectedLayerForTool) {
      return <ColorPicker layer={selectedLayerForTool} />;
    } else if (selectedTool === 'opacity' && selectedLayerForTool) {
      return <Opacity layer={selectedLayerForTool} />;
    }

    // If no color or opacity tool is selected, check for other tools
    switch (tool) {
      case 'buffer':
        return <Buffer />;
      case 'union':
        return <Union />;
      case 'intersect':
        return <Intersect />;
      case 'difference':
        return <Difference />;
      case 'data':
        return <DataList mode={"dropzone"}/>;
      case 'dissolve':
        return <Dissolve />;
      case 'clip':
        return <Clip />;
      case 'info':
        return <InfoComponent/>
      default:
        return
    }
  };

  return (
    <div className="top-bar-container">
      {renderToolComponent()}
    </div>
  );
}

export default Info;