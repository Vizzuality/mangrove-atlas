import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import classnames from 'classnames';
import Modal from 'components/modal';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import HighlightedPlaces from 'components/widget/templates/highlighted-places/component';
import highlightedPlacesConfig from 'components/widget/templates/highlighted-places/config';
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
    highlightedPlaces: PropTypes.arrayOf(PropTypes.shape({})),
    closeSearchPanel: PropTypes.func
  }

  static defaultProps = {
    isOpened: false,
    currentLocation: { name: 'Location name' },
    locations: [],
    highlightedPlaces: null,
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
    const { isOpened, currentLocation, locations, highlightedPlaces } = this.props;
    if (!currentLocation) return null;

    const { searchTerm } = this.state;
    const locationsData = searchTerm
      ? locations.filter(l => new RegExp(searchTerm, 'i').test(l.name))
      : locations;

    return (
      <Fragment>
        <MediaQuery maxWidth={breakpoints.md - 1}>
          <Modal
            className={classnames(styles.location, styles.mobile)}
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
              {highlightedPlaces && (
                <HighlightedPlaces
                  data={highlightedPlacesConfig.parse(highlightedPlaces)}
                  currentLocation={currentLocation}
                />
              )}
              <ul className={styles.list}>
                <li className={classnames(styles.listItem, 'notranslate')}>
                  <Link to={{ type: 'PAGE/APP', payload: { id: 'worldwide' } }}>Worldwide</Link>
                </li>
                {locationsData.map(location => (
                  <li key={location.id} className={classnames(styles.listItem, 'notranslate')}>
                    {location.location_type === 'aoi'
                      && <Link to={{ type: 'PAGE/AOI', payload: { id: location.id } }}>{location.name}</Link>}
                    {location.location_type === 'country'
                      && <Link to={{ type: 'PAGE/COUNTRY', payload: { iso: location.iso } }}>{location.name}</Link>}
                    {location.location_type === 'wdpa'
                      && <Link to={{ type: 'PAGE/WDPA', payload: { id: location.id } }}>{location.name}</Link>}
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" onClick={this.closeModal} className={classnames(styles.searchButton, styles.mobile)}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </Modal>
        </MediaQuery>
        <MediaQuery minWidth={breakpoints.md}>
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
              {highlightedPlaces && (
                <HighlightedPlaces
                  data={highlightedPlacesConfig.parse(highlightedPlaces)}
                  currentLocation={currentLocation}
                />
              )}
              <ul className={styles.list}>
                <li className={classnames(styles.listItem, 'notranslate')}>
                  <Link to={{ type: 'PAGE/APP', payload: { id: 'worldwide' } }}>Worldwide</Link>
                </li>
                {locationsData.map(location => (
                  <li key={location.id} className={classnames(styles.listItem, 'notranslate')}>
                    {location.location_type === 'aoi'
                      && <Link to={{ type: 'PAGE/AOI', payload: { id: location.id } }}>{location.name}</Link>}
                    {location.location_type === 'country'
                      && <Link to={{ type: 'PAGE/COUNTRY', payload: { iso: location.iso } }}>{location.name}</Link>}
                    {location.location_type === 'wdpa'
                      && <Link to={{ type: 'PAGE/WDPA', payload: { id: location.id } }}>{location.name}</Link>}
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" onClick={this.closeModal} className={styles.searchButton}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </Modal>
        </MediaQuery>
      </Fragment>
    );
  }
}

export default LocationSelector;
