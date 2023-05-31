import { atom } from 'recoil';

export const RestorationSitesFilters = atom({
  key: 'restoration-sites-filters',
  default: {},
});

export const RestorationSitesMapFilters = atom({
  key: 'restoration-sites-map-filters',
  default: {},
});

export const RestorationSitesFiltersApplication = atom({
  key: 'restoration-sites-filters-application',
  default: true,
});
