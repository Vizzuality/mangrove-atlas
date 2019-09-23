
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { format } from 'd3-format';

import styles from './style.module.scss';

const numberFormat = format(',.2f');

const Legend = ({ type, groups, direction, variant = 'rect' }) => (
  <div className={classnames(styles.widget_legend, { [styles.vertical]: direction === 'vertical' })}>
    {Object.keys(groups).map(g => (
      <div key={g} className={styles.widget_legend_group}>
        <ul className={classnames(styles.widget_legend_list, styles[`_${type}`])}>
          {groups[g].map(item => (
            <li
              key={`item-${item.color}`}
              className={classnames(styles.widget_legend_list_item,
                styles[`_${variant}`],
                styles[`_${type}`])
              }
            >
              <svg height="12" width="12">
                <rect
                  className={classnames(styles.item, styles[`_${type}`])}
                  fill={item.color}
                />
              </svg>
              <div className={styles.itemWrapper}>
                <span>{item.value}</span>
                { item.payload && item.payload.y &&
                  <span className={styles.item}>{numberFormat(item.payload.y)}</span>
                }
              </div>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

Legend.propTypes = {
  direction: PropTypes.string,
  groups: PropTypes.shape({}).isRequired,
  type: PropTypes.string
};

Legend.defaultProps = {
  direction: 'horizontal',
  type: ''
};

export default Legend;
