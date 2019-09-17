import { format } from 'd3-format';

const numberFormat = format(',.3r');

export const CONFIG = {
  parse: places => places.map(place => ({
    ...place,
    coast_length_m: numberFormat(place.coast_length_m / 1000), // to km
    unit: 'km',
  }))
};

export default CONFIG;
