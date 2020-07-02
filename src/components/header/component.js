import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import NavMenu from 'components/nav-menu';
import background from './bg-waves.svg';
import fixedBackground from './bg-fixed.svg';
import search from './Search.svg';
import searchFixed from './Search-fixed.svg';
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
    if ((location && location.name.length > 10)) {
      stylesOverride = { fontSize: 45, lineHeight: 1 };
    }
    if ((location && location.name.length > 30) || sticky) {
      stylesOverride = { fontSize: 30, lineHeight: 1 };
    }

    return (
      <div className={classnames(styles.header,
        { [styles.sticky]: sticky })}
      >
        <img
          className={classnames(styles.bg,
            { [styles.isHidden]: sticky })}
          src={background}
          alt="Background"
        />
        <img
          className={classnames(styles.bgFixed,
            { [styles.isHidden]: !sticky || window.innerWidth < breakpoints.lg + 1 })}
          src={fixedBackground}
          alt="Background"
        />
        <div>
          <div className={classnames(styles.searchBar,
            { [styles.fixed]: sticky && window.innerWidth > breakpoints.lg })}
          >
            <div className={styles.buttonsWrapper}>{sticky && <NavMenu fixedHeader />}
              <button type="button" onClick={this.clickHandler} className={styles.searchButton}>
                <img src={sticky ? searchFixed : search} alt="Search" />
              </button>
            </div>
            {location && (
              <button type="button" className={styles.titleBtn} onClick={this.clickHandler}>
                <MediaQuery minWidth={breakpoints.lg}>
                  <h1
                    className={classnames(styles.title, 'notranslate',
                      { [styles.fixed]: sticky })}
                    style={stylesOverride}
                  >
                    {location.name}
                  </h1>
                </MediaQuery>
                <MediaQuery maxWidth={breakpoints.lg - 1}>
                  <h1
                    className={classnames(styles.title, 'notranslate')}
                    style={{ fontSize: 35, lineHeight: 0.85 }}
                  >
                    {location.name}
                  </h1>
                </MediaQuery>
              </button>
            )}
          </div>
          <p className={styles.printOnly}>Powered by Mangrove atlas. https://mangrove-atlas.org</p>
        </div>
      </div>
    );
  }
}

export default Header;
