import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';

// todo: move this to widget selectors
// it make sense to have the chart type as part of configuration
const MockedChart = () => (
  <div>
    <h3>Just a mocked chart!</h3>
  </div>
);

class WidgetList extends PureComponent {
  static propTypes = {
    widgets: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string
      })
    ),
    fetchDashboards: PropTypes.func,
    fetchWidgets: PropTypes.func
  }

  static defaultProps = {
    widgets: [],
    fetchDashboards: () => null,
    fetchWidgets: () => null
  }

  componentDidMount() {
    const { fetchDashboards, fetchWidgets } = this.props;

    fetchDashboards();
    fetchWidgets();
  }

  render() {
    const { widgets } = this.props;

    return (
      <div>
        {widgets.map(widget => (
          <Widget
            key={widget.id}
            {...widget}
            chart={MockedChart}
          />
        ))}
      </div>
    );
  }
}

export default WidgetList;
