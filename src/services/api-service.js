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

  fetchMangroveSpeciesData = (params = {}) => {
    const { locationId, year } = params;
    const data = {
      "data": [{
        "agb_mgha_1": 92.4071390052209,
        "date": "2000-01-01",
        "hmax_m": 13.136334094711,
        "id": 39637,
        "net_change_m2": 0,
        "red_list_cat": "dd"
      },
      {
        "agb_mgha_1": 92.4071390052209,
        "date": "2000-01-01",
        "hmax_m": 13.136334094711,
        "id": 39637,
        "net_change_m2": 0,
        "red_list_cat": "lc"
      },
      {
        "agb_mgha_1": 92.4071390052209,
        "date": "2000-01-01",
        "hmax_m": 13.136334094711,
        "id": 39637,
        "net_change_m2": 0,
        "red_list_cat": "nt"
      },
      {
        "agb_mgha_1": 92.4071390052209,
        "date": "2000-01-01",
        "hmax_m": 13.136334094711,
        "id": 39637,
        "net_change_m2": 0,
        "red_list_cat": "vu"
      },
      {
        "agb_mgha_1": 92.4071390052209,
        "date": "2000-01-01",
        "hmax_m": 13.136334094711,
        "id": 39637,
        "net_change_m2": 0,
        "red_list_cat": "en"
      },
      {
        "agb_mgha_1": 92.4071390052209,
        "date": "2000-01-01",
        "hmax_m": 13.136334094711,
        "id": 39637,
        "net_change_m2": 0,
        "red_list_cat": "cr"
      }],
      "metadata": {
        "unit": "ha",
        "years": [2016, 2017, 2018, 2019, 2020, 2021, 2022]
      }
    }
    return data;
  }
}

export default APIService;
