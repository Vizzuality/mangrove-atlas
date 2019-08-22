import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { breakpoints } from 'utils/responsive';
import { NavigationControl } from 'react-map-gl';
import classnames from 'classnames';
// Components
import MobileLegendControl from 'components/map-legend/mobile';
import Map from 'components/map';
import BasemapSelector from 'components/basemap-selector';
import Legend from 'components/map-legend';

import styles from './style.module.scss';

class MapContainer extends PureComponent {
  static propTypes = {
    viewport: PropTypes.shape({}),
    setViewport: PropTypes.func,
    isCollapse: PropTypes.bool.isRequired,
    mapboxApiAccessToken: PropTypes.string.isRequired,
    mapStyle: PropTypes.shape({}).isRequired,
    bounds: PropTypes.shape({}).isRequired,
    goToCountry: PropTypes.func
  }

  static defaultProps = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      longitude: 0,
      latitude: 0,
      zoom: 2,
      maxZoom: 16,
      bearing: 0,
      pitch: 0
    },
    setViewport: () => { },
    goToCountry: () => { }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onViewportChange = (viewport) => {
    const { setViewport } = this.props;
    setViewport(viewport);
  }

  resize = () => {
    const { viewport } = this.props;
    this.onViewportChange({
      ...viewport,
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    const {
      mapboxApiAccessToken,
      mapStyle,
      viewport,
      bounds,
      isCollapse,
      goToCountry
    } = this.props;

    const clickHandler = ({ event }) => {
      const { features } = event;
      const country = features.find(feat => feat.layer.id === 'selected-eez-land-v2-201410');

      if (country) {
        const { properties: { ISO_3digit: countryId } } = country;
        goToCountry({ iso: countryId });
      }
    };

    return (
      <div className={styles.map}>
        <Map
          viewport={viewport}
          bounds={bounds}
          mapStyle={mapStyle}
          mapboxApiAccessToken={mapboxApiAccessToken}
          onViewportChange={this.onViewportChange}
          onClick={clickHandler}
        >
          {() => (
            <div className={styles.navigation}>
              <MediaQuery minWidth={breakpoints.md}>
                <NavigationControl />
              </MediaQuery>
            </div>
          )
          }
        </Map>

        <div className={classnames(styles.legend,
          { [styles.expanded]: !isCollapse })}
        >
          <MediaQuery maxWidth={breakpoints.md - 1}>
            <MobileLegendControl />
          </MediaQuery>
          <div className={styles.tooltip}>
            <Legend />
            <BasemapSelector />
          </div>
        </div>
      </div>
    );
  }
}

export default MapContainer;
