import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import background from './bg-shape.svg';
import fixedBackground from './bg-fixed.svg';
import styles from './style.module.scss';

class Header extends PureComponent {
  static propTypes = {
    sticky: PropTypes.bool,
    location: PropTypes.shape({
      name: PropTypes.string
    }),
    openSearchPanel: PropTypes.func
  }

  static defaultProps = {
    sticky: false,
    location: { name: 'Location name' },
    openSearchPanel: () => null
  }

  clickHandler = () => {
    const { openSearchPanel } = this.props;
    openSearchPanel();
  }


  render() {
    const { location, sticky } = this.props;
    let stylesOverride = { fontSize: 60, lineHeight: 0.85 };

    if (location && location.name.length > 10) stylesOverride = { fontSize: 45, lineHeight: 1 };
    if (location && location.name.length > 30) stylesOverride = { fontSize: 30, lineHeight: 1 };

    return (
      <div className={styles.header}>
        <img
          className={classnames(styles.bg,
            { [styles.isHidden]: sticky })}
          src={background}
          alt="Background"
        />
        <img
          className={classnames(styles.bgFixed,
            { [styles.isHidden]: !sticky })}
          src={fixedBackground}
          alt="Background"
        />
        <div className={classnames(styles.searchBar,
          { [styles.fixed]: sticky })}
        >
          <button type="button" onClick={this.clickHandler} className={styles.searchButton}>
            <FontAwesomeIcon icon={faSearch} size="lg" />
          </button>
          {location && (
            <button type="button" className={styles.titleBtn} onClick={this.clickHandler}>
              <h1
                className={classnames(styles.title, 'notranslate')}
                style={stylesOverride}
              >
                {location.name}
              </h1>
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Header;
