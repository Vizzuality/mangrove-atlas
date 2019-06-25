import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

const Select = ({ value: defaultValue, options, onChange }) => {
  const [selected, selectValue] = useState(defaultValue);

  const setSelectedValue = (e) => {
    selectValue(options.find(o => o.value === e.target.value));
    onChange(e.target.value);
  };

  return (
    <select
      value={selected.value}
      onChange={setSelectedValue}
      className={styles.select}
    >
      {options.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
    </select>
  );
};

Select.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func
};

Select.defaultProps = {
  onChange: () => {}
};

export default Select;
