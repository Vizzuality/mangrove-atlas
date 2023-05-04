import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const currentLocationAtom = atom({
  key: 'location',
  default: 'worldwide', // location_id
  // effects: [
  //   urlSyncEffect({
  //     refine: string(),
  //     history: 'push',
  //   }),
  // ],
});

export const currentLocationTypeAtom = atom({
  key: 'location-type',
  default: '', // location_type
  // effects: [
  //   urlSyncEffect({
  //     refine: string(),
  //     history: 'replace',
  //   }),
  // ],
});
