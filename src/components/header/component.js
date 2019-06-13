import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';

const Header = ({ title, setSearchActive }) => {
  function clickHandler() {
    setSearchActive(true);
  }

  return (
    <div className={styles.location_wrapper}>
      <input className={styles.location_title} type="search" placeholder={title} />
      <button type="button" onClick={clickHandler}>Find a location</button>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  setSearchActive: PropTypes.func.isRequired
};

export default Header;
