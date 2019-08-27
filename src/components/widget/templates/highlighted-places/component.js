import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import WidgetInfo from 'components/widget-info';
import Link from 'redux-first-router-link';
import styles from './style.module.scss';

const HighlightedPlaces = ({ data, currentLocation }) => (
  <Fragment>
    <div className={styles.hotspotsList}>
      {data.map(d => (
        <div
          key={d.id}
          className={classnames(styles.card, { [styles.active]: d.id === currentLocation.id })}
        >
          <span className={styles.cardInfo}>
            <h3 className="notranslate">{d.name}</h3>
            <p><span className="notranslate">{d.coast_length_m}</span> <span className="notranslate">{d.unit}</span> <span>coastline</span></p>
          </span>
          {d.id !== currentLocation.id && <Link to={{ type: 'PAGE/AOI', payload: { id: d.id } }}><span className={styles.link}>View place</span></Link>}
          <Link to={{ type: 'PAGE/AOI', payload: { id: (d.id === currentLocation.id) ? 'worldwide' : d.id } }}><span className={styles.link}>{(d.id === currentLocation.id) ? 'Back to Worldwide' : 'View place' }</span></Link>
        </div>
      ))}
    </div>
    <WidgetInfo />
  </Fragment>
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
