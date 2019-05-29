import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const SearchDashboard = ({ setSearchActive }) => {
  function clickHandler() {
    setSearchActive(false);
  }

  return (
    <div className="dashboard">
      <h1>This is the search dashboard!</h1>
      <button type="button" onClick={clickHandler}>Close</button>
    </div>
  );
};

SearchDashboard.propTypes = {
  setSearchActive: PropTypes.func.isRequired
};

export default SearchDashboard;
