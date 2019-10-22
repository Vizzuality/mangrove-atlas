import { createSelector } from 'reselect';
import { currentLocation } from 'modules/locations/selectors';

const dashboards = state => state.dashboards;

export const currentDashboard = createSelector(
  [dashboards, currentLocation],
  (_dashboards, _currentLocation) => {
    if (!_currentLocation) return null;
    const { defaults, custom } = _dashboards;
    const customDashboard = custom.find(d => String(d.location_id) === String(_currentLocation.id));
    if (customDashboard) return customDashboard;
    return defaults.find(d => d.location_type === _currentLocation.location_type);
  }
);

export default { currentDashboard };
