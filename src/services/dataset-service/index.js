import axios from 'axios';

import serializer from './wri-json-api-serializer';

class WRIService {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  fetchLayersFromDataset = (id, params = {}) => {
    return this.client.get(`/dataset/${id}/layer`, { params })
      .then(response => {
        const { status, statusText, data } = response;
        if (status >= 400) throw new Error(statusText);
        return serializer(data);
      });
  }

  fetchDatasetsLayers = datasets => {
    // We are unzipping here, you can check https://lodash.com/docs/4.17.11#unzip
    // It is better this way because Object entries, values and keys can be order inconsistent
    const [ datasetNames, datasetPromises ] = Object.entries(datasets).reduce((acc, item) => [
      [...acc[0], item[0]],
      [...acc[1], this.fetchLayersFromDataset(item[1])]
    ], [[], []]);

    return axios.all(datasetPromises)
      .then(response => {
        return datasetNames.reduce((acc, name, index) => ({
          ...acc,
          [name]: response[index]
        }), {});
      });
  }
}

export const service = new WRIService();
export default service;
