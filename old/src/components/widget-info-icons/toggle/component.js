import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

const Toggle = ({ slug, layerId, layersIds, isActive, toggleActive, toggleCollapse }) => {
const handleChange = () =>  {
  if (layersIds) {
    layersIds.forEach(lId => toggleActive({ id: slug, layerId: lId, isActive }));
  } else {
    toggleActive({ id: slug, layerId, isActive });
  }
  toggleCollapse({ id: slug });
};

  return (
    <input type="checkbox" title={isActive ? 'Hide layer' : 'Add layer to the map'} className={styles.checkbox} onChange={handleChange} checked={!!isActive} />
  );
};

Toggle.propTypes = {
  slug: PropTypes.string,
  layerId: PropTypes.string,
  layersIds: PropTypes.array,
  isActive: PropTypes.bool,
  toggleCollapse: PropTypes.func,
  toggleActive: PropTypes.func
};

Toggle.defaultProps = {
  slug: '',
  layerId: '',
  layersIds: [],
  isActive: false,
  toggleCollapse: () => null,
  toggleActive: () => null
};

export default Toggle;


