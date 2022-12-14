import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import cx from "classnames";
import Icon from 'components/icon';
import styles from './style.module.scss';

class ViewSelector extends PureComponent {
  static propTypes = {
    mapView: PropTypes.bool,
    setMobileView: PropTypes.func,
    activeLayers: PropTypes.number,
  };

  static defaultProps = {
    mapView: true,
    setMobileView: () => null,
    activeLayers: null,
  };

  state = {
    activeBtn: false,
  };

  onChangeView = () => {
    const { setMobileView, mapView } = this.props;
    this.setState({ activeBtn: !this.state.activeBtn });
    setMobileView(!mapView);
  }

  render() {
    const { mapView, activeLayers, mobile } = this.props;
    const { activeBtn } = this.state;

    return (
      <div className={cx(styles.viewSelector, {
        [styles.mobile]: mobile,
        [styles._active]: mapView && activeBtn,
      })}>
        <button
          type="button"
          onClick={this.onChangeView}
        >
          {mapView && activeBtn
            ? (<Icon name="close" />)
            : (
              <span className={classnames(styles.btnInfo,
                { [styles.activeLayers]: activeLayers !== 0 })}
              >
                {activeLayers}
              </span>
            )}
          <span className={styles.menuItemTitle}>Map</span>
        </button>
      </div>
    );
  }
}

export default ViewSelector;
