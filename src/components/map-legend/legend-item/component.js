import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import styles from './style.module.scss';

const LegendItem = ({ id, name, toggleActive, toggleWidgetActive, isCollapsed, mapView }) => {
  const onClickHandler = () => {
    toggleActive({ id, isActive: false });
    toggleWidgetActive({ layerId: id, isActive: false });
  };

  return (
    <div className={classnames(styles.legendItem,
      { [styles.collapse]: (isCollapsed && mapView) })}
    >
      <h3>{name}</h3>
      <button className={styles.removeButton} type="button" onClick={onClickHandler}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

LegendItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  toggleActive: PropTypes.func,
  isCollapsed: PropTypes.bool.isRequired,
  mapView: PropTypes.bool.isRequired
};

LegendItem.defaultProps = {
  toggleActive: () => null
};

export default LegendItem;
