import axios from 'axios';

class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  fetchLocations = (params = {}) => this.client
    .get('/locations', { params })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return data;
    });

  fetchWidgetData = (params = {}) => this.client
    .get(`/widget_data/${params.slug}`)
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return data;
    });
}

export default APIService;
