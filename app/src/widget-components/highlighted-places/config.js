export const CONFIG = {
  parse: places => places.map(place => ({
    ...place,
    coast_length_m: place.coast_length_m,
    unit: 'km',
  }))
};

export default CONFIG;
