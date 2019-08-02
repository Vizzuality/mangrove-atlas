import { createSelector } from 'reselect';
// import sumBy from 'lodash/sumBy';

const locations = state => state.locations.list;
const currentLocationId = state => state.locations.current;

export const currentLocation = createSelector(
  [locations, currentLocationId],
  (_locations, _currentId) => {
    if (!_currentId) return null;

    if (_currentId.id === 'global') {
      // const countries = _locations.filter(location => location.location_type === 'country');
      const globalData = {
        location_type: 'global',
        name: 'Worldwide',
        coast_length_m: 1634701000,
        // length_mangrove_m: {
        //   1996: sumBy(countries, c => parseFloat(c.length_mangrove_m['1996'])),
        //   2007: sumBy(countries, c => parseFloat(c.length_mangrove_m['2007'])),
        //   2008: sumBy(countries, c => parseFloat(c.length_mangrove_m['2008'])),
        //   2009: sumBy(countries, c => parseFloat(c.length_mangrove_m['2009'])),
        //   2010: sumBy(countries, c => parseFloat(c.length_mangrove_m['2010'])),
        //   2015: sumBy(countries, c => parseFloat(c.length_mangrove_m['2015'])),
        //   2016: sumBy(countries, c => parseFloat(c.length_mangrove_m['2016']))
        // },
        // mangrove_loss_m2: {
        //   1996: sumBy(countries, c => parseFloat(c.mangrove_loss_m2['1996'])),
        //   2007: sumBy(countries, c => parseFloat(c.mangrove_loss_m2['2007'])),
        //   2008: sumBy(countries, c => parseFloat(c.mangrove_loss_m2['2008'])),
        //   2009: sumBy(countries, c => parseFloat(c.mangrove_loss_m2['2009'])),
        //   2010: sumBy(countries, c => parseFloat(c.mangrove_loss_m2['2010'])),
        //   2015: sumBy(countries, c => parseFloat(c.mangrove_loss_m2['2015'])),
        //   2016: sumBy(countries, c => parseFloat(c.mangrove_loss_m2['2016']))
        // },
        // mangrove_gain_m2: {
        //   1996: sumBy(countries, c => parseFloat(c.mangrove_gain_m2['1996'])),
        //   2007: sumBy(countries, c => parseFloat(c.mangrove_gain_m2['2007'])),
        //   2008: sumBy(countries, c => parseFloat(c.mangrove_gain_m2['2008'])),
        //   2009: sumBy(countries, c => parseFloat(c.mangrove_gain_m2['2009'])),
        //   2010: sumBy(countries, c => parseFloat(c.mangrove_gain_m2['2010'])),
        //   2015: sumBy(countries, c => parseFloat(c.mangrove_gain_m2['2015'])),
        //   2016: sumBy(countries, c => parseFloat(c.mangrove_gain_m2['2016']))
        // }
      };
      return globalData;
    }

    let result;

    if (_currentId.iso) {
      result = _locations.find(location => location.iso === _currentId.iso && location.location_type === 'country');
    } else if (_currentId.id) {
      result = _locations.find(location => location.id === Number(_currentId.id));
    }

    if (!result) return null;

    return { ...result };
  }
);

export default { currentLocation };
