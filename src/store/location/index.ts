import { atom } from 'recoil';

export const currentLocationAtom = atom({
  key: 'location',
  default: 'worldwide', // location_id
});
