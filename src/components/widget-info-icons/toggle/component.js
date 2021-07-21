import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.module.scss';


const Toggle = ({ slug, layerId, layersIds, isActive, toggleActive }) => {

const handleChange = () =>  {
  if (layersIds) {
    layersIds.forEach(lId => toggleActive({ id: slug, layerId: lId, isActive: !isActive }));
  } else {
    toggleActive({ id: slug, layerId, isActive: !isActive });
  }
}
  return (
    <input type="checkbox" class={styles.checkbox} onChange={() => handleChange()} checked={isActive} />
  );
};

Toggle.propTypes = {
  isOpened: PropTypes.bool,
  closeSearchPanel: PropTypes.func
};

Toggle.defaultProps = {
  isOpened: false,
  closeSearchPanel: () => null
};

export default Toggle;


