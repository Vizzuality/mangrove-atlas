import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { format } from 'd3-format';
import Link from 'redux-first-router-link';
import styles from './style.module.scss';

const numberFormat = format(',.3r');

const ConservationHotspots = ({ conservationHotspots, currentLocation }) => {
  const { widgetData } = conservationHotspots;
  return (
    <div className={styles.hotspotsList}>
      {widgetData.map(d => (
        <div
          key={d.id}
          className={classnames(styles.card, { [styles.active]: d.id === currentLocation.id })}
        >
          <span className={styles.cardInfo}>
            <h3 className="notranslate">{d.name}</h3>
            <p><span className="notranslate">{numberFormat(d.length_coast_m / 1000)}</span> <span>km coastline</span></p>
          </span>
          {d.id !== currentLocation.id && <Link to={{ type: 'PAGE/AOI', payload: { id: d.id } }}><span>View place</span></Link>}
        </div>
      ))}
    </div>
  );
};

ConservationHotspots.propTypes = {
  conservationHotspots: PropTypes.shape({
    widgetData: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  currentLocation: PropTypes.shape({})
};

ConservationHotspots.defaultProps = {
  conservationHotspots: null,
  currentLocation: null
};

export default ConservationHotspots;
