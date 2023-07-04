import { atom } from 'recoil';

import type { NationalDashboardLayerSettingsTypes } from 'containers/datasets/national-dashboard/types';

export const nationalDashboardSettingsAtom = atom<NationalDashboardLayerSettingsTypes>({
  key: 'national-dashboard-settings',
  default: null,
});
