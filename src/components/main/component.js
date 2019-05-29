import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

import RegularDashboard from 'components/dashboard';
import SearchDashboard from 'components/search-dashboard';
import Map from 'components/map';

const Main = ({ type, id, isSearchActive }) => {
  const Dashboard = !isSearchActive ? RegularDashboard : SearchDashboard;
  return (
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
};

Main.propTypes = {
  isSearchActive: PropTypes.bool.isRequired,
  type: PropTypes.string,
  id: PropTypes.string
};

Main.defaultProps = {
  type: 'global',
  id: null
};

export default Main;
