import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { basemaps } from './constants';
import lightThumb from './thumbs/btn-light@2x.png';
import darkThumb from './thumbs/btn-dark@2x.png';
import satelliteThumb from './thumbs/btn-satellite@2x.png';
import styles from './style.module.scss';

const thumbs = {
  light: lightThumb,
  dark: darkThumb,
  satellite: satelliteThumb
};

class BasemapSelector extends PureComponent {
  static propTypes = {
    basemapName: PropTypes.string,
    setBasemap: PropTypes.func,
    isCollapsed: PropTypes.bool.isRequired,
    mapView: PropTypes.bool.isRequired
  };

  static defaultProps = {
    basemapName: 'light',
    setBasemap: () => null
  };

  onChangeBasemap = (e) => {
    const { setBasemap } = this.props;
    const selectedBasemap = e.currentTarget.dataset.basemap;

    setBasemap(selectedBasemap);
  }

  render() {
    const { basemapName, isCollapsed, mapView } = this.props;
    const currentBasemap = basemaps.find(b => b.id === basemapName);

    return (
      <div className={classnames(
        'mapboxgl-ctrl',
        styles.basemap,
        { [styles.collapse]: isCollapsed && mapView }
      )}
      >
        <div className={styles.current}>
          <h3>Map style</h3>
          <div>{currentBasemap.name}</div>
        </div>
        <div className={styles.options}>
          {basemaps.map(b => (
            <button
              key={b.id}
              type="button"
              data-basemap={b.id}
              onClick={this.onChangeBasemap}
              className={classnames(styles.basemapThumb, {
                [styles.selected]: currentBasemap.id === b.id
              })}
            >
              <img src={thumbs[b.id]} alt={b.name} width="35px" height="45px" />
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default BasemapSelector;
