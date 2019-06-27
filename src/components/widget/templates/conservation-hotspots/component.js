import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { format } from 'd3-format';
import Link from 'redux-first-router-link';
import styles from './style.module.scss';

const numberFormat = format(',.3r');

const ConservationHotspots = ({ data, currentLocation }) => {
  if (!data) return null;

  const { widgetData } = data;

  return (
    <div className={styles.hotspotsList}>
      {widgetData.map(d => (
        <div
          key={d.id}
          className={classnames(styles.card, { [styles.active]: d.id === currentLocation.id })}
        >
          <h3>{d.name}</h3>
          <p>{numberFormat(d.length_coast_m)} km coastline</p>
          {d.id !== currentLocation.id && <Link to={{ type: 'PAGE/AOI', payload: { id: d.id } }}>View place</Link>}
        </div>
      ))}
    </div>
  );
};

ConservationHotspots.propTypes = {
  data: PropTypes.shape({
    widgetData: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  currentLocation: PropTypes.shape({})
};

ConservationHotspots.defaultProps = {
  data: null,
  currentLocation: null
};

export default ConservationHotspots;
