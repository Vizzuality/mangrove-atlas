import { createSelector } from 'reselect';

const dashboards = state => state.dashboards;

export const currentDashboard = createSelector(
  [dashboards],
  (_dashboards) => {
    const { current } = _dashboards;
    const selected = current || 'default';
    return selected;
  }
);

export default { currentDashboard };
