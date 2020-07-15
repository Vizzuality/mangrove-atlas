import axios from 'axios';

class AlertsService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://us-central1-mangrove-atlas-246414.cloudfunctions.net',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  fetchAlerts = (params = {}) => {
    const { id, year } = params;
    return this.client
      .get(`/fetch-alerts?year=2019&location_id=504`, { params })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
  }
}

export default AlertsService;
