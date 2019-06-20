import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.scss';

class LocationSelector extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      name: PropTypes.string
    })
  }

  static defaultProps = {
    location: { name: 'Location name' }
  }

  // clickHandler = () => {
  //   const { setSearchActive } = this.props;

  //   setSearchActive(true);
  // }

  render() {
    const { location } = this.props;

    return (
      <div className={styles.location}>
        <input className={styles.title} type="search" placeholder={location.name} />
        <button type="button" onClick={this.clickHandler} className={styles.searchButton}>
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </div>
    );
  }
}

export default LocationSelector;
