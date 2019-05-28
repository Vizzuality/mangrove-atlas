import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title }) => (
  <header>
    <h1>{title}</h1>
    <button type="button">Find a location</button>
    <h2>LOGO</h2>
  </header>
);

Header.propTypes = {
  title: PropTypes.string.isRequired
};

export default Header;
