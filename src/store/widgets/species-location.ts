import { atom } from 'jotai';

import type { DataResponse } from '@/containers/datasets/species-location/types';

export const SpeciesLocationState = atom(null as DataResponse['data'][number] | null);
