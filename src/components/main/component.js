import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import Dashboard from 'components/dashboard';
import Map from 'components/map';

const Main = ({ type, id }) => (
  <main>
    <Dashboard type={type} id={id} />
    <div className="map-wrapper">
      <Map
        className="mangrove-map-component"
        height="100vh"
        width="100%"
      />
    </div>
  </main>
);

Main.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string
};

Main.defaultProps = {
  type: 'global',
  id: null
};

export default Main;
