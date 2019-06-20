import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.scss';

const LegendItem = ({ id, name, toggleActive }) => {
  const onClickHandler = () => toggleActive({ id, isActive: false });

  return (
    <div className={styles.legendItem}>
      {name}
      <button className={styles.removeButton} type="button" onClick={onClickHandler}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

LegendItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  toggleActive: PropTypes.func
};

LegendItem.defaultProps = {
  toggleActive: () => null
};

export default LegendItem;
