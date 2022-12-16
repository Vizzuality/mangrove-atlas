
import axios from 'axios';

const WIDGETS = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v2/widgets`,
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

export default WIDGETS;