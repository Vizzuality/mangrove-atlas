import React from 'react';
import PropTypes from 'prop-types';

import Chart from 'components/chart';
import Widget from 'components/widget';

import styles from './style.module.scss';

function ChartWidget({
  sentence,
  component,
  chart = true,
  chartData: {
    data,
    config
  },
  children,
  className,
  ...props
}) {
  return (
    <Widget className={styles.widget} data={data} {...props}>
      <div className={styles.widget_template}>
        <div className={styles.sentence} key={Date.now()}>
          {sentence}
        </div>
        {chart && (
          <div>{chart}</div>
          // <Chart
          //   {...props}
          //   data={data}
          //   config={config}
          // />
        )}
        {children}
        {component}
      </div>
    </Widget>
  );
}

Widget.propTypes = {
  sentence: PropTypes.node,
  chartData: PropTypes.shape({}),
  chart: PropTypes.boolean,
  children: PropTypes.node,
  className: PropTypes.string,
};

Widget.defaultProps = {
  sentence: null,
  chartData: {},
  chart: true,
  children: null,
  className: null,
};

export default ChartWidget;
