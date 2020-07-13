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
    const { id } = params;
    return this.client
      .get(`/fetch-alerts`, { params })
      .then((response) => {
        const { status, statusText } = response;
        if (status >= 400) throw new Error(statusText);
        return response;
      });
  }
}

export default AlertsService;
