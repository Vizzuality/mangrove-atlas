import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.scss';

class Header extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      name: PropTypes.string
    }),
    openSearchPanel: PropTypes.func
  }

  static defaultProps = {
    location: { name: 'Location name' },
    openSearchPanel: () => null
  }

  clickHandler = () => {
    const { openSearchPanel } = this.props;

    openSearchPanel();
  }

  render() {
    const { location } = this.props;

    return (
      <div className={styles.header}>
        <h1 className={styles.title}>{location.name}</h1>
        <button type="button" onClick={this.clickHandler} className={styles.searchButton}>
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </div>
    );
  }
}

export default Header;
