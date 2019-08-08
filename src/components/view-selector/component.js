import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
      <div className={styles.container}>
        <Button
          hasBackground
          hasContrast
          onClick={this.onChangeView}
        >
          <div className={styles.btnTitle}>{mapView ? 'Map View' : 'Whatever view'}</div>
          <span className={styles.btnInfo}>{activeLayers}</span>
        </Button>
      </div>
    );
  }
}

export default ViewSelector;
