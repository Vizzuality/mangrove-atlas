import axios from 'axios';
import serializer from 'utils/geoJsonToJson';

/**
 * Datasets ID shouldn't change.
 * In case you need to update them:
 * https://api.mapbox.com/datasets/v1/mangrove-atlas
 */
const datasetIds = {
  locations: 'cjwum1jj60mh22no5cj1q67dk',
  dashboards: 'cjwum0ds523ag2in6jigine6x',
  widgets: 'cjwum0t940jf62town9y45ev0',
  layers: 'cjwum16ja0j2y2plplw2ktpqy'
};

class DatasetService {
  constructor({ entityName }) {
    this.entityName = entityName;
    this.client = axios.create({
      baseURL: `https://api.mapbox.com/datasets/v1/mangrove-atlas/${datasetIds[entityName]}`,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  fetch = (params = {}) => this.client
    .get('/features', {
      params: {
        ...params,
        access_token: process.env.REACT_APP_MAPBOX_TOKEN
      }
    })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return serializer(data);
    });
}

export default DatasetService;
