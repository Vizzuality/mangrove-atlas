import React from 'react';
import PropTypes from 'prop-types';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';

import './style.scss';

import RegularDashboard from 'components/dashboard';
import SearchDashboard from 'components/search-dashboard';
import Map from 'components/map';

const Main = ({ type, id, isSearchActive, layers }) => {
  const Dashboard = !isSearchActive ? RegularDashboard : SearchDashboard;
  return (
    <main>
      <Dashboard type={type} id={id} />
      <div className="map-wrapper">
        <Map
          className="mangrove-map-component"
          height="100vh"
          width="100%"
        >
          {map => (
            <LayerManager map={map} plugin={PluginMapboxGl}>
              {layers.map(layer => (
                <Layer key={layer.id} {...layer} />
              ))}
            </LayerManager>
          )}
        </Map>
      </div>
    </main>
  );
};

Main.propTypes = {
  isSearchActive: PropTypes.bool.isRequired,
  type: PropTypes.string,
  id: PropTypes.string,
  layers: PropTypes.arrayOf(PropTypes.shape({}))
};

Main.defaultProps = {
  type: 'global',
  id: null,
  layers: []
};

export default Main;
