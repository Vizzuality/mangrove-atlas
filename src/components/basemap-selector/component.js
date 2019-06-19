import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { basemaps } from './constants';
import lightThumb from './thumbs/light.png';
import darkThumb from './thumbs/dark.png';
import satelliteThumb from './thumbs/satellite.jpeg';
import styles from './style.module.scss';

const thumbs = {
  light: lightThumb,
  dark: darkThumb,
  satellite: satelliteThumb
};

class BasemapSelector extends PureComponent {
  static propTypes = {
    basemapName: PropTypes.string,
    setBasemap: PropTypes.func
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
    const { basemapName } = this.props;
    const currentBasemap = basemaps.find(b => b.id === basemapName);

    return (
      <div className={styles.basemap}>
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
              <img src={thumbs[b.id]} alt={b.name} />
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default BasemapSelector;
