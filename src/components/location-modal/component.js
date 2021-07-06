/* eslint-disable react/sort-comp */
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Modal from 'components/modal';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import HighlightedPlaces from 'widget-components/highlighted-places/component';
import highlightedPlacesConfig from 'widget-components/highlighted-places/config';
import LocationsList from 'components/locations-list';

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

  // eslint-disable-next-line camelcase
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
        <MediaQuery maxWidth={breakpoints.lg - 1}>
          <Modal
            isOpen={isOpened}
            onRequestClose={this.closeModal}
          >
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              className={classnames(styles.searchInput, 'notranslate')}
              placeholder="Type name"
              onChange={this.updateSearchTerm}
            />
            {highlightedPlaces && !searchTerm && (
              <HighlightedPlaces
                data={highlightedPlacesConfig.parse(highlightedPlaces)}
                currentLocation={currentLocation}
              />
            )}

            <LocationsList locationsData={locationsData} />
          </Modal>
        </MediaQuery>
        <MediaQuery minWidth={breakpoints.lg}>
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
                  placeholder="Type name"
                  onChange={this.updateSearchTerm}
                />
              </div>
              {highlightedPlaces && !searchTerm && (
                <HighlightedPlaces
                  data={highlightedPlacesConfig.parse(highlightedPlaces)}
                  currentLocation={currentLocation}
                />
              )}
              <LocationsList locationsData={locationsData} />
            </div>
          </Modal>
        </MediaQuery>
      </Fragment>
    );
  }
}

export default LocationSelector;
