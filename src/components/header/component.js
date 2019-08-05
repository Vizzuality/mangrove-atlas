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
    location: PropTypes.shape({
      name: PropTypes.string
    }),
    openSearchPanel: PropTypes.func
  }

  state = {
    isFixed: false
  };

  static defaultProps = {
    location: { name: 'Location name' },
    openSearchPanel: () => null
  }

  clickHandler = () => {
    const { openSearchPanel } = this.props;

    openSearchPanel();
  }

  setSticky = isFixed => this.setState({ isFixed });

  render() {
    const { location, sticky } = this.props;

    console.log(sticky)

    let stylesOverride = { fontSize: 60, lineHeight: 0.85 };

    if (location && location.name.length > 10) stylesOverride = { fontSize: 45, lineHeight: 1 };
    if (location && location.name.length > 30) stylesOverride = { fontSize: 30, lineHeight: 1 };

    return (
      <div className={styles.header}>
        <img
          className={classnames(styles.bg,
            { [styles.isVisible]: sticky }
          src={background}
          alt="Background"
        />
        <img
          className={classnames(styles.bg,
            { [styles.visible]: sticky },
            { [styles.invisible]: !sticky })}
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
