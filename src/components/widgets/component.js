import React from 'react';
import PropTypes from 'prop-types';

import HighlightedPlaces from 'widget-components/highlighted-places';
import MangroveCoverage from 'widget-components/mangrove-coverage';
import MangroveNetChange from 'widget-components/mangrove-net-change';
import MangroveActivity from 'widget-components/mangrove-activity';
import MangroveAlerts from 'widget-components/mangrove-alerts';
import MangroveHeight from 'widget-components/mangrove-height';

import styles from './style.module.scss';

const templates = new Map([
    ['mangrove_coverage', {
      component: MangroveCoverage,
      data: null
    }],
    ['mangrove_net_change', {
      component: MangroveNetChange,
      data: null
    }],
    ['mangrove_activity', {
      component: MangroveActivity,
      data: null
    }],
    ['highlighted_places', {
      component: HighlightedPlaces,
      data: null
    }],
    ['mangrove_alerts', {
      component: MangroveAlerts,
      data: null
    }],
    ['mangrove_height', {
      component: MangroveHeight,
      data: null
    }]
]);

function WidgetList({
  widgets,
  ...parentProps
}) {
  return (

    <div className={styles.widgets}>
      {widgets.map(widget => {
        const Widget = templates.get(widget.slug).component;

        return (
          <Widget
            key={widget.slug}
            {...widget}
            {...parentProps}
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
  )
};

WidgetList.defaultProps = {
  widgets: []
};

export default WidgetList;
