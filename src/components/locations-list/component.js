import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import classnames from 'classnames';
import styles from './style.module.scss';

class LocationsList extends PureComponent {
  static propTypes = {
    locationsData: PropTypes.arrayOf(PropTypes.shape({})).isRequired
  };

  getType = (location) => {
    if (location.location_type === 'aoi') return 'PAGE/AOI';
    if (location.location_type === 'country') return 'PAGE/COUNTRY';
    if (location.location_type === 'wdpa') return 'PAGE/WDPA';
    return null;
  }

  getPayload = location => (
    (location.location_type === 'aoi' || location.location_type === 'wdpa')
      ? { id: location.id }
      : { iso: location.iso }
  );

  formatName = (string) => {
    const tag = string.charAt(0).toUpperCase() + string.slice(1);
    return tag.replace('Aoi', 'Area of interest');
  }

  render() {
    const { locationsData } = this.props;

    return (
      <ul className={styles.list}>
        <li className={classnames(styles.listItem, 'notranslate')}>
          <Link to={{ type: 'PAGE/APP', payload: { id: 'worldwide' } }}>Worldwide</Link>
        </li>
        {locationsData.map(location => (
          <li key={location.id} className={classnames(styles.listItem, 'notranslate')}>
            <Link to={{ type: this.getType(location), payload: this.getPayload(location) }}>
              <div className={styles.items}>
                <span>
                  {location.name}
                </span>
                <span className={styles.tag}>
                  {this.formatName(location.location_type)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}

export default LocationsList;
