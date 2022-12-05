import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import classnames from 'classnames';
import styles from './style.module.scss';

const locationNames = {
  worldwide: 'Worldwide',
  country: 'Country',
  wdpa: 'WDPA'
};

const LocationsList = ({ closeSearchPanel, locationsData }) => {
  const [ newLocation, saveNewLocation ] = useState(null);

  useEffect(() => {
    if(newLocation) {
      closeSearchPanel()
    }
  },[newLocation]);

  const getType = (location) => {
    if (location.location_type === 'worldwide') return 'PAGE/APP';
    if (location.location_type === 'custom-area') return 'PAGE/CUSTOM';
    if (location.location_type === 'country') return 'PAGE/COUNTRY';
    if (location.location_type === 'wdpa') return 'PAGE/WDPA';
    return null;
  };

  const getPayload = location => ({
    ...(location.location_type === 'country' && { iso: location.iso, id: location.id }),
    ...(location.location_type === 'cutom-area' && { id: location.id }),
    ...(location.location_type !== 'country' && { id: location.location_id }),
    ...(location.location_type === 'worldwide' && { id: 'worldwide' })
  });

  return (
    <ul className={styles.list}>
      {locationsData.map(location => (
        <li key={location.id} className={classnames(styles.listItem, 'notranslate')}>
          <Link to={{ type: getType(location), payload: getPayload(location) }}>
            <div className={styles.items} onClick={() => saveNewLocation(location)}>
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
