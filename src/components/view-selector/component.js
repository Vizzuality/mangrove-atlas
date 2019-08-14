import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'components/button';
import styles from './style.module.scss';

class ViewSelector extends PureComponent {
  static propTypes = {
    mapView: PropTypes.bool,
    setMobileView: PropTypes.func,
    activeLayers: PropTypes.number
  };

  static defaultProps = {
    mapView: true,
    setMobileView: () => null,
    activeLayers: null
  };

  onChangeView = () => {
    const { setMobileView, mapView } = this.props;
    setMobileView(!mapView);
  }

  render() {
    const { mapView, activeLayers } = this.props;
    return (
      <Button
        hasBackground
        hasContrast={activeLayers === 0}
        onClick={this.onChangeView}
        className={styles.container}
      >
        <div className={styles.btnTitle}>
          {mapView ? 'Dashboard View' : 'Map View'}
        </div>
        <span className={classnames(styles.btnInfo,
          { [styles.activeLayers]: activeLayers !== 0 })}
        >
          {activeLayers}
        </span>
      </Button>
    );
  }
}

export default ViewSelector;
