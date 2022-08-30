import axios from 'axios';
import { geoJsonToJson } from 'utils/jsonParsers';

const account = process.env.REACT_APP_MAPBOX_ACCOUNT;
/**
 * Datasets ID shouldn't change.
 * In case you need to update them:
 * https://api.mapbox.com/styles/v1/{account}
 */
const datasetIds = {
  locations: 'cjxfwu00x1dfe2ipec6axjhk8',
  dashboards: 'cjwum0ds523ag2in6jigine6x',
  widgets: 'cjwum0t940jf62town9y45ev0',
  layers: 'cjx1q0hbn0e282imghtsuiacg'
};

class DatasetService {
  constructor({ entityName }) {
    this.entityName = entityName;
    this.client = axios.create({
      baseURL: `https://api.mapbox.com/datasets/v1/${account}/${datasetIds[entityName]}`,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  fetch = (params = {}) => this.client
    .get('/features', {
      params: {
        ...params,
        access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
      }
    })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return geoJsonToJson(data);
    });
    
}

export default DatasetService;
