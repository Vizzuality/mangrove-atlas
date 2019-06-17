
import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.module.scss';

const Legend = ({ groups }) => (
  <div className={styles.widget_legend}>
    {Object.keys(groups).map(g => (
      <div key={g} className={styles.widget_legend_group}>
        <ul className={styles.widget_legend_list}>
          {groups[g].map(item => (
            <li
              key={`item-${item.color}`}
              className={styles.widget_legend_list_item}
            >
              <svg height="12" width="12">
                <rect width="13" height="13" fill={item.color} />
              </svg>

              <span>
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

Legend.propTypes = {
  groups: PropTypes.arrayOf({}).isRequired
};

export default Legend;
