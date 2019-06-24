import { createSelector } from 'reselect';
import { currentLocation } from 'modules/locations/selectors';

const dashboards = state => state.dashboards.list;

export const currentDashboard = createSelector(
  [dashboards, currentLocation],
  (_dashboards, _currentLocation) => {
    if (!_currentLocation) return null;
    return _dashboards.find(location => location.id === _currentLocation.dashboardId);
  }
);

export default { currentDashboard };
