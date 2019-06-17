import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Chart } from '@earth-pulse/components';

class HumanImpact extends React.PureComponent {
  static propTypes = {
    template: PropTypes.string.isRequired,
    chart: PropTypes.shape(PropTypes.object).isRequired,
    config: PropTypes.shape({}).isRequired,
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
    const { chart, template, config } = this.props;

    return (
      <Fragment>
        <div className="widget--template">
          {template}
        </div>

        {/* Chart */}
        {!!chart.length && (
          <Chart
            data={chart}
            config={config}
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

export default HumanImpact;
