import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';
import TEMPLATES from 'components/widget/templates';
import CONFIGS from 'components/widget/templates/configs';
import styles from './style.module.scss';

function WidgetList({
  widgets,
  widgetData,
  ...parentProps
}) {
  return (

    <div className={styles.widgets}>
      {widgets.map((widget) => {
        const template = TEMPLATES[widget.slug];
        if (!template) {
          return null;
        }

        return (
          <Widget
            key={widget.slug}
            isCollapsed={widget.isCollpased}
            {...widget}
            {...parentProps}
            data={widgetData}
            widgetConfig={CONFIGS[widget.slug]}
            template={template}
          />
        );
      })}
    </div>
  );
}

WidgetList.propTypes = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string
    })
  ),
  widgetData: PropTypes.shape({})
};

WidgetList.defaultProps = {
  widgets: [],
  widgetData: {}
};

export default WidgetList;
