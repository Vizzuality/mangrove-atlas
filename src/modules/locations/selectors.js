import { createSelector } from "reselect";

const locations = (state) => state.locations.list;
const currentLocationId = (state) => state.locations.current;

export const highlightedPlaces = createSelector([locations], (_locations) =>
  _locations.filter(
    (location) =>
      location.location_type === "wdpa" &&
      (location.location_id === "0edd0ebb-892b-5774-8ce5-08e0ba7136b1" ||
        location.location_id === "4a79230b-7ecb-58ae-ba0d-0f57faa2a104")
  )
);

export const currentLocation = createSelector(
  [locations, currentLocationId],
  (_locations, _currentId) => {
    if (!_currentId) return null;

    let result;

    if (_currentId.id === "worldwide") {
      result = _locations?.find(
        (location) => location.location_type === "worldwide"
      );
    } else if (_currentId.iso) {
      result = _locations?.find(
        (location) =>
          location.iso === _currentId.iso &&
          location.location_type === "country"
      );
    } else if (_currentId.id) {
      result = _locations?.find(
        ({ id, location_id: locationId }) =>
          id === Number(_currentId.id) || locationId === _currentId.id
      );
    }

    if (!result) return null;
    return { ...result };
  }
);
