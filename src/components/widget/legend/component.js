
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './style.module.scss';

const Legend = ({ groups, direction }) => (
  <div className={classnames(styles.widget_legend, { [styles.vertical]: direction === 'vertical' })}>
    {Object.keys(groups).map(g => (
      <div key={g} className={styles.widget_legend_group}>
        <ul className={styles.widget_legend_list}>
          {groups[g].map(item => (
            <li
              key={`item-${item.color}`}
              className={`${styles.widget_legend_list_item} ${styles.net}`}
            >
              <svg height="12" width="12">
                <rect
                  className={classnames(styles.item, { [styles.net]: (item.value).toLowerCase() === 'net result' })}
                  fill={item.color}
                />
              </svg>

              <span>
                {(item.value).charAt(0).toUpperCase() + (item.value).slice(1)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

Legend.propTypes = {
  direction: PropTypes.string,
  groups: PropTypes.shape({}).isRequired
};

Legend.defaultProps = {
  direction: 'horizontal'
};

export default Legend;
