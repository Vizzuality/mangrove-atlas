import React from 'react';
import PropTypes from 'prop-types';

import Chart from 'components/chart';
import Widget from 'components/widget';

import styles from './style.module.scss';

function ChartWidget({
  sentence,
  chartData: {
    data,
    config
  },
  ...props
}) {
  return (
    <Widget className={styles.widget} {...props}>
      <div className={styles.widget_template}>
        <div className={styles.sentence}>
          {sentence}
        </div>
        <Chart
          data={data}
          config={config}
        />
      </div>
    </Widget>
  );
}

Widget.propTypes = {
  sentence: PropTypes.string,
  chartData: PropTypes.shape({})
};

Widget.defaultProps = {
  sentence: '',
  chartData: {}
};

export default ChartWidget;
