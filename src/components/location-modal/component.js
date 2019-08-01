import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import classnames from 'classnames';
import Modal from 'components/modal';
import ConservationHotspots from 'components/widget/templates/conservation-hotspots/component';
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
    conservationHotspots: PropTypes.shape({}),
    closeSearchPanel: PropTypes.func
  }

  static defaultProps = {
    isOpened: false,
    currentLocation: { name: 'Location name' },
    locations: [],
    conservationHotspots: {},
    closeSearchPanel: () => null
  }

  state = {
    searchTerm: null
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpened) this.resetTerm();
  }

  closeModal = () => {
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
    const { isOpened, currentLocation, locations, conservationHotspots } = this.props;
    if (!currentLocation) return null;

    const { searchTerm } = this.state;
    const locationsData = searchTerm
      ? locations.filter(l => new RegExp(searchTerm, 'i').test(l.name))
      : locations;

    return (
      <Modal
        className={styles.location}
        isOpen={isOpened}
        onRequestClose={this.closeModal}
      >
        <div className={styles.content}>
          <div className={styles.search}>
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              className={classnames(styles.searchInput, 'notranslate')}
              placeholder={currentLocation.name}
              onChange={this.updateSearchTerm}
            />
          </div>
          <ConservationHotspots
            conservationHotspots={conservationHotspots}
            currentLocation={currentLocation}
          />
          <ul className={styles.list}>
            <li className={classnames(styles.listItem, 'notranslate')}>
              <Link to={{ type: 'PAGE/APP', payload: { id: 'global' } }}>Worldwide</Link>
            </li>
            {locationsData.map(location => (
              <li key={location.id} className={classnames(styles.listItem, 'notranslate')}>
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
        <button type="button" onClick={this.closeModal} className={styles.searchButton}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
      </Modal>
    );
  }
}

export default LocationSelector;
