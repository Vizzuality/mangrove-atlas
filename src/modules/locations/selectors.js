import { createSelector } from 'reselect';

const locations = state => state.locations.list;
const currentLocationId = state => state.locations.current;

export const currentLocation = createSelector(
  [locations, currentLocationId],
  (_locations, _currentId) => {
    if (_currentId === 'global') {
      return { type: 'global', name: 'Worldwide', dashboardId: '61382203bcbaa30bcf9644ed96b56441' };
    }
    return _locations.find(location => location.id === _currentId);
  }
);

export default { currentLocation };
