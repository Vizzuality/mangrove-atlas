import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import styles from './style.module.scss';


class ViewSelector extends PureComponent {
  static propTypes = {
    mapView: PropTypes.bool,
    setMapView: PropTypes.func,
    activeLayers: PropTypes.number
  };

  static defaultProps = {
    mapView: true,
    setMapView: () => null,
    activeLayers: null
  };

  onChangeView = (mapView) => {
    const { setMapView } = this.props;
    setMapView(!mapView);
  }

  render() {
    const { mapView, activeLayers } = this.props;
    return (
      <div className={styles.container}>
        <Button
          hasBackground
          hasContrast
          onClick={() => this.onChangeView(mapView)}
        >
          <div className={styles.btnTitle}>{mapView ? 'Map View' : 'Whatever view'}</div>
          <span className={styles.btnInfo}>{activeLayers}</span>
        </Button>
      </div>
    );
  }
}

export default ViewSelector;
