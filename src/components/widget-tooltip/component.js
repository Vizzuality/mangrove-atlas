import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './style.module.scss';

function getValue(item, value) {
  const { format, suffix = '', preffix = '' } = item;
  let val = value;

  if (format && typeof format === 'function') {
    val = format(val);
  }

  return `${preffix}${val}${suffix}`;
}

function Tooltip({ payload, settings, style, hideZeros }) {
  const values = payload && payload.length > 0 && payload[0].payload;

  return (
    <div>
      {settings && settings.length && (
        <div className={styles.chart_tooltip} style={style}>
          {settings.map(
            d => (hideZeros && values[d.key] ? null : (
              <div
                key={d.key}
                className={classnames(styles.data_line, {
                  [`${styles.(d.position)}`]: d.position})
                }
              >
                {/* LABEL */}
                {((d.label && d.labelKey) || d.key) && (
                  <div className={styles.data_label}>
                    {d.color && (
                      <div
                        className={styles.data_color}
                        style={{ backgroundColor: d.color }}
                      />
                    )}

                    {d.key === 'break' ? (
                      <span className={styles.break_label}>{d.label}</span>
                    ) : (
                      <span>{d.label || values[d.labelKey]}</span>
                    )}
                  </div>
                )}

                {/* UNIT */}
                <div
                  className={styles.data_value}
                >
                  {getValue(d, values[d.key])}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

Tooltip.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.shape({})),
  settings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  style: PropTypes.shape({}),
  hideZeros: PropTypes.bool
};

Tooltip.defaultProps = {
  payload: [],
  style: {},
  hideZeros: false
}

export default Tooltip;
