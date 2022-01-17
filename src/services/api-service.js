import axios from 'axios';

class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`,
      headers: { 'Content-Type': 'application/json' }
    });

    // staging
    this.clientStaging = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL_STAGING}/api/v2`,
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

  fetchMangroveData = (params = {}) => {
    const { id, iso } = params;
    const locationParam = id || iso || 'worldwide';

    return this.client
      .get(`/locations/${locationParam}/mangrove_data`)
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
  }

  fetchRankingData = (params = {}) => {
    const { filter = 'gain', startDate = '2007', endDate = '2016', limit = 5 } = params;
    return this.client
      .get(`/locations?rank_by=${filter}_m2&start_date=${startDate}&end_date=${endDate}&location_type=country&limit=${limit}&dir=desc`)
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
  }

  fetchMangroveProtectionData = (params = {}) => {
    const { locationId = 1155, year = 2016 } = params;
    return this.clientStaging
    .get(`/widgets/protected-areas?year=${year}&location_id=${locationId}&dir=desc`)
    .then((response) => {
      const { status, statusText,
        //data
      } = response;

      const data = {
        "data": [
          {
          "location_id": 1155,
          "total": 6574.39,
          "protected": true,
          "percentage": 84.48,
          "year": 2016,
          "unit": 'ha',
        },
        {
          "location_id": 1155,
          "total": 549.39,
          "protected": true,
          "percentage": 17.12,
          "year": 2020,
          "unit": 'ha',
        },
      ].filter(d => d.year === year),
        "metadata": {
          "unit": "ha",
          "years": [2016, 2017, 2018, 2019, 2020, 2021, 2022]
        }
      }

      if (status >= 400) throw new Error(statusText);
      return data;
    });
  }
}

export default APIService;
