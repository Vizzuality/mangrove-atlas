import { alertsStartDate, alertsEndDate } from "./constants";
export default {
  list: [],
  isLoading: false,
  error: null,
  isOpened: false,
  ui: {
    extent: {
      year: null,
      unit: null,
    },
    net: {
      startYear: null,
      endYear: null,
      range: {
        startYear: null,
        endYear: null
      },
      currentYear: null,
      years: [],
      unit: null
    },
    alerts: {
      startDate: alertsStartDate,
      endDate: alertsEndDate,
      year: 2020,
    },
    protection: {
      year: null,
      unit: null,
    },
    restoration: {
      year: null,
      unit: null,
    },
    degradation_and_loss: {
      year: null,
      unit: null,
    },
    investment_potential: {
      year: null,
      unit: null,
    },
    species: {
      year: null,
      unit: null,
    },
    emissions_mitigation: {
      year: null,
      unit: null,
    },
    height: {
      year: null,
      unit: null,
    },
    biomass: {
      year: null,
      unit: null,
    },
  },
  isCollapsed: true,
};
