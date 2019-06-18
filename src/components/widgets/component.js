import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';
import Button from 'components/button';
import TEMPLATES from 'components/widget/templates';
import CONFIGS from 'components/widget/templates/configs';

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
            widgetConfig={CONFIGS[widget.slug]}
          >
            {({ slug, data, ...props }) => (
              <Fragment>
                {/* Template */}
                {!!TEMPLATES[widget.slug] && React.createElement(TEMPLATES[widget.slug], {
                  ...data,
                  ...props
                })}
              </Fragment>
            )}
          </Widget>
        ))}
      </div>
    );
  }
}

export default WidgetList;
