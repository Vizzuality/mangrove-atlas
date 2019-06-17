import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.scss';

const Header = ({ title, setSearchActive }) => {
  function clickHandler() {
    setSearchActive(true);
  }

  return (
    <div className={styles.location}>
      <input className={styles.title} type="search" placeholder={title} />
      <button type="button" onClick={clickHandler} className={styles.searchButton}>
        <FontAwesomeIcon icon={faSearch} size="lg" />
      </button>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  setSearchActive: PropTypes.func.isRequired
};

export default Header;
