import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.scss';

class LocationSelector extends PureComponent {
  static propTypes = {
    isOpened: PropTypes.bool,
    currentLocation: PropTypes.shape({
      name: PropTypes.string
    }),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    closeSearchPanel: PropTypes.func
  }

  static defaultProps = {
    isOpened: false,
    currentLocation: { name: 'Location name' },
    locations: [],
    closeSearchPanel: () => null
  }

  state = {
    searchTerm: null
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpened) this.resetTerm();
  }

  clickHandler = () => {
    const { closeSearchPanel } = this.props;

    closeSearchPanel();
    this.resetTerm();
  }

  resetTerm = () => this.setState({ searchTerm: null })

  updateSearchTerm = (e) => {
    if (e.currentTarget.value === '') {
      this.resetTerm();
    } else {
      this.setState({ searchTerm: e.currentTarget.value });
    }
  }

  render() {
    const { isOpened, currentLocation, locations } = this.props;

    if (!isOpened) return null;

    const { searchTerm } = this.state;
    const locationsData = searchTerm
      ? locations.filter(l => new RegExp(searchTerm, 'i').test(l.name))
      : locations;

    return (
      <div className={styles.location}>
        <div className={styles.content}>
          <div className={styles.search}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={currentLocation.name}
              onChange={this.updateSearchTerm}
            />
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <Link to={{ type: 'PAGE/APP', payload: { id: 'global' } }}>Worldwide</Link>
            </li>
            {locationsData.map(location => (
              <li key={location.id} className={styles.listItem}>
                {location.type === 'aoi'
                  && <Link to={{ type: 'PAGE/AOI', payload: { id: location.id } }}>{location.name}</Link>}
                {(location.type === 'country' || location.type === 'admin0-eez')
                  && <Link to={{ type: 'PAGE/COUNTRY', payload: { iso: location.iso } }}>{location.name}</Link>}
                {location.type === 'wdpa'
                  && <Link to={{ type: 'PAGE/WDPA', payload: { id: location.id } }}>{location.name}</Link>}
              </li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={this.clickHandler} className={styles.searchButton}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
      </div>
    );
  }
}

export default LocationSelector;
