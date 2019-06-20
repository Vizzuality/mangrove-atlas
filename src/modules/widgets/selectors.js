import { createSelector } from 'reselect';
import { currentDashboard } from 'modules/dashboards/selectors';
import { currentLocation } from 'modules/locations/selectors';

const widgets = state => state.widgets.list;

export const dashboardWidgets = createSelector(
  [widgets, currentDashboard],
  (_widgets, _currentDashboard) => {
    if (!_currentDashboard) return [];
    const widgetIds = _currentDashboard.widget_ids;
    return _widgets.filter(widget => widgetIds.includes(widget.id));
  }
);

export const activeWidgets = createSelector(
  [dashboardWidgets],
  _widgets => _widgets.filter(widget => widget.isActive)
);

export const coverageWidget = createSelector(
  [currentLocation],
  (_currentLocation) => {
    const years = Object.keys(_currentLocation.length_mangrove_m);
    const total = _currentLocation.length_coast_m;

    const widgetData = years.map(year => ({
      x: year,
      y: 100,
      color: '#00857F',
      percentage: _currentLocation.length_mangrove_m[year] / total * 100,
      unit: '%',
      value: _currentLocation.length_mangrove_m[year],
      label: year
    }));

    return {
      metadata: { total, years },
      widgetData
    };
  }
);

export default {
  dashboardWidgets
};
