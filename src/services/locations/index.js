
import axios from 'axios';

const LOCATIONS = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v2/locations`,
  headers: { 'Content-Type': 'application/json' },
  transformResponse: (data) => {
    try {
      const parsedData = JSON.parse(data);
      return {
        data: parsedData.data,
        meta: parsedData.meta,
      };
    } catch (error) {
      return data;
    }
  },
});

export default LOCATIONS;