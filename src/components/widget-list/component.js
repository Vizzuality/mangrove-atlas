import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';
import Button from 'components/button';

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
    collapseAll: PropTypes.func,
    expandAll: PropTypes.func,
    fetchDashboards: PropTypes.func,
    fetchWidgets: PropTypes.func
  }

  static defaultProps = {
    widgets: [],
    collapseAll: () => null,
    expandAll: () => null,
    fetchDashboards: () => null,
    fetchWidgets: () => null
  }

  componentDidMount() {
    const { fetchDashboards, fetchWidgets } = this.props;

    fetchDashboards();
    fetchWidgets();
  }

  render() {
    const { collapseAll, expandAll, isCollapsed, widgets } = this.props;

    return (
      <div>
        {
          isCollapsed
            ? <Button onClick={expandAll}>Expand all</Button>
            : <Button onClick={collapseAll}>Collapse all</Button>
        }
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
