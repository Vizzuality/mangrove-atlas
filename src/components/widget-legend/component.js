import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { format } from 'd3-format';
import DangerousHTML from 'react-dangerous-html';

import styles from './style.module.scss';

const numberFormat = format(',.2f');

const Legend = ({ sup, type, position, widgetSpecific, groups, direction, variant, unit }) => {

  return (
    <div className={classnames(styles.widget_legend, { [styles.vertical]: direction === 'vertical' })}>
      {Object.keys(groups).map(g => (
        <div key={g} className={styles.widget_legend_group}>

          <ul className={classnames(styles.widget_legend_list, styles[`_${type}`], styles[`_${position}`])}>
            {groups[g].map((item, i) => (
              <li
                key={`item-${i + 1}-${item.color}`}
                className={classnames(styles.widget_legend_list_item,
                  styles[`_${item.variant || variant}`],
                  styles[`_${widgetSpecific}`],
                  styles[`_${type}`])
                }
              >
                {widgetSpecific !== 'activity' && (
                  <svg height="12" width="12">
                    <rect
                      className={classnames(styles.item, styles[`_${type}`])}
                      fill={item.color}
                    />
                  </svg>)}
                {widgetSpecific === 'activity' && (
                <div
                  className={classnames(styles.item, styles[`_${type}`], styles[`_${item.value}`])}
                  style={{ backgroundColor: item.color }}
                />)}

                <div className={classnames(styles.itemWrapper, styles[`_${type}`])}>
                  <span>{item.value}</span>
                  {sup && <DangerousHTML html={unit} />}
                  {item.payload && item.payload.y && type !== 'height'
                    && <span className={styles.item}>
                      {`${numberFormat(item.payload.y)}  ${unit}`}</span>
                  }
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

Legend.propTypes = {
  direction: PropTypes.string,
  groups: PropTypes.shape({}).isRequired,
  widgetSpecific: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
  unit: PropTypes.string
};

Legend.defaultProps = {
  direction: 'horizontal',
  widgetSpecific: '',
  type: '',
  variant: 'rect',
  unit: ''
};

export default Legend;
