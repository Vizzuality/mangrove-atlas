import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';
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
  }

  static defaultProps = {
    widgets: []
  }

  render() {
    const {
      isCollapsed,
      widgets,
      widgetData,
      ...parentProps
    } = this.props;

    return (
      <div className={styles.widgets}>
        {widgets.map(widget => (
          <Widget
            key={widget.slug}
            {...widget}
            {...parentProps}
            data={widgetData}
            widgetConfig={CONFIGS[widget.slug]}
          >
            {({ slug, ...props }) => (
              <Fragment>
                {!!TEMPLATES[widget.slug] && React.createElement(TEMPLATES[widget.slug], {
                  slug,
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
