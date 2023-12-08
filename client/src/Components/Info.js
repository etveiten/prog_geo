import React from 'react';
import Buffer from "../Components/Toolbar/Buffer";
import Union from "../Components/Toolbar/Union";
import Intersect from "../Components/Toolbar/Intersect";
import Difference from "../Components/Toolbar/Difference";
import DataList from "../Components/Sidebar/DataHandler/DataList";
import Dissolve from "../Components/Toolbar/Dissolve";
import Clip from '../Components/Toolbar/Clip';

function Info({ tool }) {
  const renderToolComponent = () => {
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
        return <DataList mode={"dropzone"}/>
      case 'dissolve':
        return <Dissolve/>
      case 'clip':
        return <Clip/>
      default:
        return <div>Select a tool</div>;
    }
  };

  return (
    <div className="top-bar-container">
      {renderToolComponent()}
    </div>
  );
}

export default Info;
