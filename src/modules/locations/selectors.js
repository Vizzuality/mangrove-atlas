import { createSelector } from 'reselect';
import sumBy from 'lodash/sumBy';

const locations = state => state.locations.list;
const currentLocationId = state => state.locations.current;

export const currentLocation = createSelector(
  [locations, currentLocationId],
  (_locations, _currentId) => {
    const countries = _locations.filter(location => location.type === 'admin0-eez');

    if (_currentId === 'global') {
      const globalData = {
        type: 'global',
        name: 'Worldwide',
        dashboardId: '61382203bcbaa30bcf9644ed96b56441',
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

    return _locations.find(location => location.id === _currentId);
  }
);

export default { currentLocation };
