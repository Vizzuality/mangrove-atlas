import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ setLocationPage }) => (
  <footer>
    <h2>Active layers:</h2>
    <button type="button" onClick={() => setLocationPage()}>Global</button>
    <button type="button" onClick={() => setLocationPage({ type: 'aoi', id: 'rufiki' })}>Rufiki</button>
    <button type="button" onClick={() => setLocationPage({ type: 'aoi', id: 'saloum' })}>Saloum</button>
  </footer>
);

Footer.propTypes = {
  setLocationPage: PropTypes.func.isRequired
};

export default Footer;
