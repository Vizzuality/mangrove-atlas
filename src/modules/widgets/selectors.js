import { createSelector } from 'reselect';
import { currentDashboard } from 'modules/dashboards/selectors';
import { currentLocation } from 'modules/locations/selectors';

const widgets = state => state.widgets.list;
const locations = state => state.locations.list;

export const dashboardWidgets = createSelector(
  [widgets, currentDashboard, currentLocation],
  (_widgets, _currentDashboard, _currentLocation) => {
    if (!_currentLocation) return [];

    const { location_type } = _currentLocation;
    return _widgets.filter(({ categoryIds, locationType }) => categoryIds.includes(_currentDashboard) && locationType.includes(location_type));
  }
);

export const activeWidgets = createSelector(
  [widgets],
  _widgets => _widgets.filter(widget => widget.isActive)
);

export const activeLayers = createSelector(
  [activeWidgets],
  _activeWidgets => _activeWidgets.length
);


export const conservationHotspots = createSelector(
  [locations],
  (_locations) => {
    // Saloum and Rufiji
    const ids = [1534, 1555];
    // const location_ids = [ '2_000000000000000009ed', '2_0000000000000000059e'];
    const widgetData = _locations.filter(location => ids.includes(location.id));

    return { widgetData };
  }
);

export const coverageWidget = createSelector(
  [currentLocation],
  (_currentLocation) => {
    const years = Object.keys(_currentLocation.length_mangrove_m);
    const total = _currentLocation.length_coast_m;

    const widgetData = years.map(year => ({
      x: Number(year),
      y: 100,
      color: '#00857F',
      percentage: _currentLocation.length_mangrove_m[year] / total * 100,
      unit: '%',
      value: _currentLocation.length_mangrove_m[year],
      label: `Coastline coverage in ${year}`
    }));

    return {
      metadata: { total, years },
      widgetData
    };
  }
);

export const netChangeWidget = createSelector(
  [currentLocation],
  (_currentLocation) => {
    if (_currentLocation.mangrove_loss_m2 && _currentLocation.mangrove_loss_m2) {
      const gain = _currentLocation.mangrove_gain_m2;
      const loss = _currentLocation.mangrove_loss_m2;
      const years = Object.keys(loss);
      const totalLoss = years
        .reduce((year, nextYear) => parseFloat(loss[year] || 0) + parseFloat(loss[nextYear] || 0));

      const widgetData = years.map(year => ({
        Gain: parseFloat(gain[year]),
        Loss: -parseFloat(loss[year]),
        'Net change': parseFloat(gain[year]) - parseFloat(loss[year]),
        year
      }));

      return {
        metadata: { totalLoss, years },
        widgetData
      };
    }

    return { metadata: { years: [] }, widgetData: [] };
  }
);
