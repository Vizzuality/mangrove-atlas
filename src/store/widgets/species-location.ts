import { atom } from 'recoil';

import type { DataResponse } from 'containers/datasets/species-location/types';

export const SpeciesLocationState = atom<DataResponse['data'][number]>({
  key: 'species-location',
  default: null,
});
