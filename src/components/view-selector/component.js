import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'components/button';
import styles from './style.module.scss';


class ViewSelector extends PureComponent {
  static propTypes = {
    mapView: PropTypes.bool,
    setMapView: PropTypes.func
  };

  static defaultProps = {
    mapView: true,
    setMapView: () => null
  };

  onChangeView = () => {
    const { mapView, setMapView } = this.props;
    setMapView(!mapView);
  }

  render() {
    const { mapView } = this.props;

    return (
      <div className={styles.container}>
        <Button
          hasBackground
          hasContrast
          onClick={this.onChangeView}
        >
          {mapView ? 'Map View' : 'Whatever view'}
        </Button>
      </div>
    );
  }
}

export default ViewSelector;
