import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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

    let stylesOverride = { fontSize: 60, lineHeight: 0.85 };

    if (location && location.name.length > 10) stylesOverride = { fontSize: 45, lineHeight: 1 };
    if (location && location.name.length > 30) stylesOverride = { fontSize: 30, lineHeight: 1 };

    return (
      <div className={styles.header}>
        {location && <h1 className={classnames(styles.title, 'notranslate')} style={stylesOverride}>{location.name}</h1>}
        <button type="button" onClick={this.clickHandler} className={styles.searchButton}>
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </div>
    );
  }
}

export default Header;
