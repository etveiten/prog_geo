/**
 * * 
 * Component that shows information from the selected layer
 *TODO: Layer EPSG projection, features, attribute table etc
 */

 import React, { useContext } from 'react';
 import { LayersContext } from './Sidebar/Layers/LayersContext';
 

function InfoComponent() {

    const { selectedLayerDetails } = useContext(LayersContext); // Destructure the selectedLayerDetails from context
    
    return (
        <div className="info-component">
          {selectedLayerDetails ? (
            <>
              <h2>Layer Details</h2>
              <p><strong>Layer ID:</strong> {selectedLayerDetails.layerId}</p>
              <div>
                <h3>Properties:</h3>
                {/* Ensure properties is an object and render its key-value pairs */}
                {Object.entries(selectedLayerDetails.properties).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
              </div>
            </>
          ) : (
            <p>Select a layer to view its details.</p>
          )}
        </div>
      );
}

export default InfoComponent