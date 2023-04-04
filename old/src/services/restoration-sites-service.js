import axios from 'axios';

class RestorationSitesService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_MRTT_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  fetchSites(params = {}) {
    return this.client
      .get('/sites', { params })
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
  }
}

export default RestorationSitesService;
