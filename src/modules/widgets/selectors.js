import { createSelector } from 'reselect';
import { currentDashboard } from 'modules/dashboards/selectors';

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

export default {
  dashboardWidgets
};
