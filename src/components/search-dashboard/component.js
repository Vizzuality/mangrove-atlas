import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

const SearchDashboard = ({ setSearchActive }) => {
  function clickHandler() {
    setSearchActive(false);
  }

  return (
    <div className={styles.dashboard}>
      <h1>This is the search dashboard!</h1>
      <button type="button" onClick={clickHandler}>Close</button>
    </div>
  );
};

SearchDashboard.propTypes = {
  setSearchActive: PropTypes.func.isRequired
};

export default SearchDashboard;
