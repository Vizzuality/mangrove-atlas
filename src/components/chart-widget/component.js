import React from 'react';
// import PropTypes from 'prop-types';

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
    <Widget {...props}>
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

// Widget.propTypes = {
//   name: PropTypes.string.isRequired,
//   slug: PropTypes.string.isRequired,
//   layerId: PropTypes.string,
//   layersIds: PropTypes.arrayOf(PropTypes.string),
//   location: PropTypes.shape({}),
//   isActive: PropTypes.bool,
//   isCollapsed: PropTypes.bool,
//   isLoading: PropTypes.bool,
//   toggleActive: PropTypes.func,
//   toggleCollapse: PropTypes.func
// };

// Widget.defaultProps = {
//   isActive: false,
//   isCollapsed: false,
//   isLoading: false,
//   layerId: null,
//   layersIds: null,
//   location: null,
//   toggleActive: () => { },
//   toggleCollapse: () => { }
// };

export default ChartWidget;