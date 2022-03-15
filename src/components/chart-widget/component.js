import React from 'react';
import PropTypes from 'prop-types';

import Chart from 'components/chart';
import Widget from 'components/widget';

import styles from './style.module.scss';

function ChartWidget({
  sentence,
  component,
  chartData: {
    data,
    config
  },
  className,
  ...props
}) {

  return (
    <Widget className={styles.widget} data={data} {...props}>
      <div className={styles.widget_template}>
        <div className={styles.sentence} key={Date.now()}>
          {sentence}
        </div>
        <Chart
          {...props}
          data={data}
          config={config}
        />
        {component}
      </div>
    </Widget>
  );
}

Widget.propTypes = {
  sentence: PropTypes.node,
  chartData: PropTypes.shape({})
};

Widget.defaultProps = {
  sentence: null,
  chartData: {}
};

export default ChartWidget;
