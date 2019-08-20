import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import classnames from 'classnames';
import styles from './style.module.scss';

function LocationsList({ locationsData }) {
  const getType = (location) => {
    if (location.location_type === 'worldwide') return 'PAGE/APP';
    if (location.location_type === 'aoi') return 'PAGE/AOI';
    if (location.location_type === 'country') return 'PAGE/COUNTRY';
    if (location.location_type === 'wdpa') return 'PAGE/WDPA';
    return null;
  };

  const getPayload = location => (
    (location.location_type === 'country')
      ? { iso: location.iso }
      : { id: location.id }
  );

  const formatName = (string) => {
    const tag = string.charAt(0).toUpperCase() + string.slice(1);
    return tag.replace('Aoi', 'Area of interest');
  };

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
                {formatName(location.location_type)}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

LocationsList.propTypes = {
  locationsData: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default LocationsList;
