import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Chart from 'components/chart';

class MangroveNetChange extends React.PureComponent {
  static propTypes = {
    template: PropTypes.string.isRequired,
    chart: PropTypes.arrayOf(PropTypes.object).isRequired,
    chartConfig: PropTypes.shape({}).isRequired,
  };

  render() {
    const { chart, template, chartConfig } = this.props;

    return (
      <Fragment>
        <div className="widget_template">
          {template}
        </div>

        {/* Chart */}
        {!!chart.length && (
          <Chart
            data={chart}
            config={chartConfig}
          />
        )}
      </Fragment>
    );
  }
}

export default MangroveNetChange;
