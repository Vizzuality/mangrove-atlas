import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Chart from 'components/chart';

class MangroveCoverage extends React.PureComponent {
  static propTypes = {
    template: PropTypes.string.isRequired,
    chart: PropTypes.arrayOf(PropTypes.object).isRequired,
    chartConfig: PropTypes.shape({}).isRequired,
    collapsed: PropTypes.bool
  };

  static defaultProps = {
    collapsed: false
  };

  collapsed() {
    const { template } = this.props;

    return (
      <div className="widget--template">
        {template}
      </div>
    );
  }

  expanded() {
    const { chart, template, chartConfig } = this.props;
    return (
      <Fragment>
        <div className="widget--template">
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

  render() {
    const { collapsed } = this.props;

    const content = (collapsed) ? this.collapsed() : this.expanded();

    return content;
  }
}

export default MangroveCoverage;
