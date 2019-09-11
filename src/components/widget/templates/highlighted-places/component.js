import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link from 'redux-first-router-link';
import styles from './style.module.scss';
import Rufiji from './images/rufiji.jpg';
import Saloum from './images/saloum.jpg';
import Worldwide from './images/worldwide.jpg';

const HighlightedPlaces = ({ data, currentLocation, isCollapsed }) => (
  <div className={classnames(styles.hotspotsList,
    { [styles.collapsed]: isCollapsed })}
  >
    {data.map(d => (
      <Link key={d.id} to={{ type: 'PAGE/AOI', payload: { id: d.id } }}>
        {d.id !== currentLocation.id && (
          <div
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 64.18%, rgba(0,0,0,0) 100%), url(${d.name === 'Rufiji' ? Rufiji : Saloum})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
            className={classnames(styles.card, { [styles.active]: d.id === currentLocation.id })}
          >
            <span className={styles.cardInfo}>
              <h3 className="notranslate">{d.name}</h3>
              <p><span className="notranslate">{d.coast_length_m}</span> <span className="notranslate">{d.unit}</span></p>
            </span>
          </div>
        )}
      </Link>
    ))
    }
    {currentLocation.location_type === 'aoi' && (
      <Link to={{ type: 'PAGE/APP' }}>
        <div
          key={currentLocation.id}
          style={{
            backgroundImage: `url(${Worldwide})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
          className={classnames(styles.card,
            { [styles.hidden]: currentLocation.location_type === 'worldwide' })}
        >
          <span className={styles.cardInfo}>
            <h3 className={classnames('notranslate', styles.title)}>Worlwide</h3>
          </span>
        </div>
      </Link>
    )}
  </div>
);


HighlightedPlaces.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  currentLocation: PropTypes.shape({}),
  isCollapsed: PropTypes.bool
};

HighlightedPlaces.defaultProps = {
  data: null,
  currentLocation: null,
  isCollapsed: false
};

export default HighlightedPlaces;
