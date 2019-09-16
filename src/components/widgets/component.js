import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';
import TEMPLATES from 'components/widget/templates';
import CONFIGS from 'components/widget/templates/configs';
import styles from './style.module.scss';

function WidgetList({
  widgets,
  widgetData,
  rankingData,
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
            data={widget.slug === 'mangrove_activity' ? rankingData : widgetData}
            widgetConfig={CONFIGS[widget.slug]}
            rankingData={rankingData}
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
  rankingData: PropTypes.shape({}),
  widgetData: PropTypes.shape({})
};

WidgetList.defaultProps = {
  widgets: [],
  rankingData: {},
  widgetData: {}
};

export default WidgetList;
