import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import classnames from 'classnames';
import styles from './style.module.scss';

const locationNames = {
  worldwide: 'Worldwide',
  aoi: 'Area of interest',
  country: 'Country',
  wdpa: 'WDPA'
};

const LocationsList = ({ locationsData }) => {
  const getType = (location) => {
    if (location.location_type === 'worldwide') return 'PAGE/APP';
    if (location.location_type === 'aoi') return 'PAGE/AOI';
    if (location.location_type === 'country') return 'PAGE/COUNTRY';
    if (location.location_type === 'wdpa') return 'PAGE/WDPA';
    return null;
  };

  const getPayload = location => ({
    ...(location.location_type === 'country' && { iso: location.iso }),
    ...(location.location_type !== 'country' && { id: location.location_id }),
    ...(location.location_type === 'worldwide' && { id: 'worldwide' })
  });

  return (
    <ul className={styles.list}>
      {locationsData.map(location => (
        <li key={location.id} className={classnames(styles.listItem, 'notranslate')}>
          <Link to={{ type: getType(location), payload: getPayload(location) }}>
            <div className={styles.items}>
              <span>
                {location.name}
              </span>
              <span className={styles.tag}>
                {locationNames[location.location_type]}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

LocationsList.propTypes = {
  locationsData: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default LocationsList;
