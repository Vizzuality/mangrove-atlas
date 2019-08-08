import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'redux-first-router-link';
import styles from './style.module.scss';

const HighlightedPlaces = ({ data, currentLocation }) => (
  <div className={styles.hotspotsList}>
    {data.map(d => (
      <div
        key={d.id}
        className={classnames(styles.card, { [styles.active]: d.id === currentLocation.id })}
      >
        <h3 className="notranslate">{d.name}</h3>
        <p><span className="notranslate">{d.coast_length_m}</span> <span className="notranslate">{d.unit}</span> <span>coastline</span></p>
        {d.id !== currentLocation.id && <Link to={{ type: 'PAGE/AOI', payload: { id: d.id } }}>View place</Link>}
      </div>
    ))}
  </div>
);

HighlightedPlaces.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  currentLocation: PropTypes.shape({}),
};

HighlightedPlaces.defaultProps = {
  data: null,
  currentLocation: null,
};

export default HighlightedPlaces;
