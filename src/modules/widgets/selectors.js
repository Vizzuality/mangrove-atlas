import { createSelector } from 'reselect';

const allWidgets = state => state.widgets.list;
const dashboardWidgets = state => state.dashboard.widgets;

export const getDashboardWidgets = createSelector(
  [allWidgets, dashboardWidgets], (_allWidgets, _dashboardWidgets) => _dashboardWidgets.map(
    widget => ({
      ...widget,
      title: _allWidgets[widget.id].title,
      slug: _allWidgets[widget.id].slug
    })
  )
);

export default {
  getDashboardWidgets
};
