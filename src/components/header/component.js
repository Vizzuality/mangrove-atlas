import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title, setSearchActive }) => {
  function clickHandler() {
    setSearchActive(true);
  }

  return (
    <header>
      <h1>{title}</h1>
      <button type="button" onClick={clickHandler}>Find a location</button>
      <h2>LOGO</h2>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  setSearchActive: PropTypes.func.isRequired
};

export default Header;
