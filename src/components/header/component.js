import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import OnScroll from 'react-on-scroll';
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
    const { location } = this.props;
    const { isFixed } = this.state;

    let stylesOverride = { fontSize: 60, lineHeight: 0.85 };

    if (location && location.name.length > 10) stylesOverride = { fontSize: 45, lineHeight: 1 };
    if (location && location.name.length > 30) stylesOverride = { fontSize: 30, lineHeight: 1 };

    return (
      <OnScroll
        triggers={[
          { top: -40, callback: visible => this.setSticky(visible) },
        ]}
      >
        <div className={styles.header}>
          <img
            className={classnames(styles.bg,
              { [styles.visible]: !isFixed },
              { [styles.invisible]: isFixed })}
            src={background}
            alt="Background"
          />
          <img
            className={classnames(styles.bg,
              { [styles.visible]: isFixed },
              { [styles.invisible]: !isFixed })}
            src={fixedBackground}
            alt="Background"
          />
          <div className={classnames(styles.searchBar,
            { [styles.fixed]: isFixed })}
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
      </OnScroll>
    );
  }
}

export default Header;
