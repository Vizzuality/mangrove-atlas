import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

  clickHandler = () => {
    const { closeSearchPanel } = this.props;

    closeSearchPanel();
  }

  updateSearchTerm = (e) => {
    if (e.currentTarget.value === '') {
      this.setState({ searchTerm: null });
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
          <div>
            <input
              type="search"
              className={styles.title}
              placeholder={currentLocation.name}
              onChange={this.updateSearchTerm}
            />
          </div>
          <div>
            {locationsData.map(location => (
              <li key={location.id}>{location.name}</li>
            ))}
          </div>
        </div>
        <button type="button" onClick={this.clickHandler} className={styles.searchButton}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
      </div>
    );
  }
}

export default LocationSelector;
