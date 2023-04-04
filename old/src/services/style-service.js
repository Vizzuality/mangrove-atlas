import axios from 'axios';

const account = process.env.REACT_APP_MAPBOX_ACCOUNT;
/**
 * Style ID shouldn't change.
 * In case you need to update them:
 * https://api.mapbox.com/styles/v1/{account}
 */
const styleIds = {
  layers: 'clb3iwy6o00kz14o69l7p9pyf'
};

class StyleService {
  constructor({ entityName }) {
    this.entityName = entityName;
    this.client = axios.create({
      baseURL: `https://api.mapbox.com/styles/v1/${account}/${styleIds[entityName]}`,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  fetch = (params = {}) => this.client
    .get('/', {
      params: {
        ...params,
        access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
      }
    })
    .then((response) => {
      const { status, statusText, data } = response;
      if (status >= 400) throw new Error(statusText);
      return data;
    });
}

export default StyleService;
