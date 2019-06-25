import { createSelector } from 'reselect';
import { defaultDashboards } from 'modules/dashboards/constants';
import sumBy from 'lodash/sumBy';

const locations = state => state.locations.list;
const currentLocationId = state => state.locations.current;

export const currentLocation = createSelector(
  [locations, currentLocationId],
  (_locations, _currentId) => {
    if (!_currentId) return null;

    if (_currentId.id === 'global') {
      const countries = _locations.filter(location => location.type === 'admin0-eez');
      const globalData = {
        type: 'global',
        name: 'Worldwide',
        dashboardId: defaultDashboards.global,
        length_coast_m: 1634701000,
        length_mangrove_m: {
          1996: sumBy(countries, c => c.length_mangrove_m['1996']),
          2007: sumBy(countries, c => c.length_mangrove_m['2007']),
          2008: sumBy(countries, c => c.length_mangrove_m['2008']),
          2009: sumBy(countries, c => c.length_mangrove_m['2009']),
          2010: sumBy(countries, c => c.length_mangrove_m['2010']),
          2015: sumBy(countries, c => c.length_mangrove_m['2015']),
          2016: sumBy(countries, c => c.length_mangrove_m['2016'])
        }
      };
      return globalData;
    }

    const result = _locations
      .find(location => (location.iso === _currentId.iso || location.id === _currentId.id));

    if (!result) return null;

    console.log(result);

    return { ...result, dashboardId: result.dashboardId || defaultDashboards[result.type] };
  }
);

export default { currentLocation };
