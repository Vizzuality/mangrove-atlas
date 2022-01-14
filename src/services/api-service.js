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
    .get('/v2/locations', { params })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return data;
    });

  fetchMangroveData = (params = {}) => {
    const { id, iso } = params;
    const locationParam = id || iso || 'worldwide';

    return this.client
      .get(`/v1/locations/${locationParam}/mangrove_data`)
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
  }

  fetchRankingData = (params = {}) => {
    const { filter = 'gain', startDate = '2007', endDate = '2016', limit = 5 } = params;
    return this.client
      .get(`/v1/locations?rank_by=${filter}_m2&start_date=${startDate}&end_date=${endDate}&location_type=country&limit=${limit}&dir=desc`)
      .then((response) => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return data;
      });
  }

  fetchMangroveProtectionData = (params = {}) => {
    const { locationId = '1_2_74', year = 2016 } = params;
    return this.client
    // .get(`/v2/widgets/protected-areas?year=${year}&location_id=${locationId}&dir=desc`)
    .get(`/v2/widgets/protected-areas?&location_id=${locationId}&dir=desc`)
    .then((response) => {
      const { status, statusText,
        data
      } = response;

      const filteredData = data.data.filter(d => d.year === year);

      if (status >= 400) throw new Error(statusText);
      return filteredData[0];
    });
  };
  
  fetchMangroveSpeciesData = (params = {}) => {
    const { locationId, year } = params;
    const data = {
      "data": [{
        "agb_hist_mgha_1": null,
        "agb_mgha_1": 92.4071390052209,
        "agb_tco2e": null,
        "area_m2": null,
        "bgb_tco2e": null,
        "con_hotspot_summary_km2": null,
        "date": "2000-01-01",
        "gain_m2": null,
        "hba_hist_m": null,
        "hba_m": null,
        "hmax_hist_m": null,
        "hmax_m": 13.136334094711,
        "id": 39637,
        "length_m": null,
        "loss_m2": null,
        "net_change_m2": 0,
        "soc_tco2e": null,
        "toc_hist_tco2eha": null,
        "toc_tco2e": null,
      },
      {
        "agb_hist_mgha_1": null,
        "agb_mgha_1": 92.4071390052209,
        "agb_tco2e": null,
        "area_m2": null,
        "bgb_tco2e": null,
        "con_hotspot_summary_km2": null,
        "date": "2000-01-01",
        "gain_m2": null,
        "hba_hist_m": null,
        "hba_m": null,
        "hmax_hist_m": null,
        "hmax_m": 13.136334094711,
        "id": 39637,
        "length_m": null,
        "loss_m2": null,
        "net_change_m2": 0,
        "soc_tco2e": null,
        "toc_hist_tco2eha": null,
        "toc_tco2e": null,
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
