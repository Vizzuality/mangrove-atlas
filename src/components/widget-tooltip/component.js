import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import cx from 'classnames';

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
              (((d.label && d.labelKey) || !!d.key) || (values && !!d.key)) && <div
                key={d.key}
                className={classnames(styles.data_line, styles[d.type], styles[d.position])}
              >

                {/* LABEL */}
                {((d.label && d.labelKey) || !!d.key) && (
                  <div className={classnames(styles.data_label, styles[d.position])}>
                    {d.color && (
                      <div
                        className={classnames(styles.data_color, styles[d.bulletType])}
                        style={{ backgroundColor: d.color }}
                      />
                    )}

                    {values && d.key && (
                      <>
                        {(d.key === 'break')
                          ? <span className={styles.break_label}>{d.label}</span>
                          : <span>{d.label || values[d.labelKey]}</span>}
                      </>
                    )}
                  </div>
                )}

                {values && !!d.key && (
                  <div className={cx({
                    [styles.data_value]: d.type !== 'species',
                    [styles.data_value_species]: d.type === 'species'
                  })}>
                    {d.type === 'species' && (
                      <svg width="10" height="12">
                        <rect width="2" height="12" fill={values.color} />
                      </svg>
                    )}
                    {getValue(d, values[d.key])} {!!d.unit && d.unit}
                  </div>
                )}
                
                {d.type === 'species' && (
                  <p className={styles.description_label}>{d.description}</p>
                )}
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
};

export default Tooltip;
