import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'redux-first-router-link';
import styles from './style.module.scss';
import Rufiji from './images/rufiji1.jpg';
import Saloum from './images/saloum1.jpg';


const HighlightedPlaces = ({ data, currentLocation }) => (

  <div className={styles.hotspotsList}>
    {data.map(d => (
      <div
        key={d.id}
        style={{
          backgroundImage: `url(${d.name === 'Rufiji' ? Rufiji : Saloum})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        className={classnames(styles.card, { [styles.active]: d.id === currentLocation.id })}
      >
        <span className={styles.cardInfo}>
          <h3 className="notranslate">{d.name}</h3>
          <p><span className="notranslate">{d.coast_length_m}</span> <span className="notranslate">{d.unit}</span> <span>coastline</span></p>
        </span>
        {d.id !== currentLocation.id && <Link to={{ type: 'PAGE/AOI', payload: { id: d.id } }}><span className={styles.link}>View place</span></Link>}
        {d.id === currentLocation.id && <Link to={{ type: 'PAGE/AOI', payload: { id: 'worldwide' } }}><span className={styles.link}>Back to Worldwide</span></Link>}
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
