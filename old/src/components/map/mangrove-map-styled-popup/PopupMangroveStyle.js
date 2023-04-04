import { Popup } from 'react-map-gl';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './style.module.scss';

const PopupMangroveStyle = ({
  removePopUp, longitude, latitude, children,
}) => (
  <Popup
    anchor="bottom"
    longitude={longitude || null}
    latitude={latitude || null}
    onClose={removePopUp}
    captureScroll
    className={styles.popup}
  >
    <div className={styles['popup-content']} aria-live="polite">
      <div className="tooltip-fill" />
      {children}
    </div>
  </Popup>
);


PopupMangroveStyle.propTypes = {
  children: PropTypes.node.isRequired,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  removePopUp: PropTypes.func.isRequired,
};

PopupMangroveStyle.defaultProps = {
  latitude: undefined,
  longitude: undefined,
};

export default PopupMangroveStyle;
