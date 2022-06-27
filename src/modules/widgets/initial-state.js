import { alertsStartDate, alertsEndDate } from "./constants";
export default {
  list: [],
  isLoading: false,
  error: null,
  isOpened: false,
  ui: {
    alerts: {
      startDate: alertsStartDate,
      endDate: alertsEndDate,
      year: 2020,
    },
    protection: {
      year: null,
      unit: null,
    }
  },
  isCollapsed: true,
};
