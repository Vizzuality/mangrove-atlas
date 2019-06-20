import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';
import Button from 'components/button';
import TEMPLATES from 'components/widget/templates';
import CONFIGS from 'components/widget/templates/configs';
import styles from './style.module.scss';

class WidgetList extends PureComponent {
  static propTypes = {
    widgets: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string
      })
    ),
    collapseAll: PropTypes.func,
    expandAll: PropTypes.func
  }

  static defaultProps = {
    widgets: [],
    collapseAll: () => null,
    expandAll: () => null
  }

  onClickCollapseAll = () => {
    const { collapseAll } = this.props;
    collapseAll();
  }

  onClickExpandAll = () => {
    const { expandAll } = this.props;
    expandAll();
  }

  render() {
    const { isCollapsed, widgets } = this.props;

    return (
      <div className={styles.widgets}>
        <div className={styles.actionBar}>
          {
            isCollapsed
              ? <Button onClick={this.onClickExpandAll}>Expand all</Button>
              : <Button onClick={this.onClickCollapseAll}>Collapse all</Button>
          }
        </div>
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
