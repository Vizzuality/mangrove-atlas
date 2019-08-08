import { createSelector } from 'reselect';
// import sumBy from 'lodash/sumBy';

const locations = state => state.locations.list;
const currentLocationId = state => state.locations.current;

export const highlightedAreas = createSelector(
  [locations],
  (_locations) => _locations.find(location => location.location_type === 'worldwide')
);

export const currentLocation = createSelector(
  [locations, currentLocationId],
  (_locations, _currentId) => {
    if (!_currentId) return null;

    let result;

    if (_currentId.id === 'global') {
      result = _locations.find(location => location.location_type === 'worldwide');
    }

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
