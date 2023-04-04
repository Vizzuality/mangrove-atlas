import { createSelector } from "reselect";

const locations = (state) => state.locations.list;
const locationSelected = (state) => state.locations.current;

export const highlightedPlaces = createSelector([locations], (_locations) =>
  _locations.filter(
    (location) =>
      location.location_type === "wdpa" &&
      (location.location_id === "0edd0ebb-892b-5774-8ce5-08e0ba7136b1" ||
        location.location_id === "4a79230b-7ecb-58ae-ba0d-0f57faa2a104")
  )
);

export const currentLocation = createSelector(
  [locations, locationSelected],
  (_locations, _locationSelected) => {
    if (!_locationSelected) return null;

    let result;

    if (_locationSelected.id === "worldwide") {
      result = _locations?.find(
        (location) => location.location_type === "worldwide"
      );
    } else if (_locationSelected.iso === 'custom-area') {
      result = _locationSelected; 
      } else if (_locationSelected.iso) {
      result = _locations?.find(
        (location) =>
          location.iso === _locationSelected.iso &&
          location.location_type === "country"
      );
    } else if (_locationSelected.id) {
      result = _locations?.find(
        ({ id, location_id: locationId }) =>
          id === Number(_locationSelected.id) || locationId === _locationSelected.id
      );
    }

    if (!result) return null;
    return { ...result };
  }
);
