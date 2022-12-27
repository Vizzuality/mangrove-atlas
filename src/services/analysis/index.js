
import axios from 'axios';

const ANALYSIS = axios.create({
  baseURL: 'https://us-central1-mangrove-atlas-246414.cloudfunctions.net',
  headers: { 'Content-Type': 'application/json' },
  transformResponse: (data) => {

    try {
      const parsedData = JSON.parse(data);
      return {
        data: parsedData.data,
        meta: parsedData.metadata,
      };
    } catch (error) {
      return data;
    }
  },
});

export default ANALYSIS;