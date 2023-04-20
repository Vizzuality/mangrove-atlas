import { atom } from 'recoil';

export const currentLocation = atom({
  key: 'location',
  default: 'worldwide', // location_id
});
