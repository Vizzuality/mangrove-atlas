
import axios from 'axios';
import Jsona from 'jsona';

const dataFormatter = new Jsona();

const WIDGETS = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v2/widgets`,
  headers: { 'Content-Type': 'application/json' },
  transformResponse: (data) => {
    try {
      const parsedData = JSON.parse(data);
      return {
        data: dataFormatter.deserialize(parsedData),
        meta: parsedData.meta,
      };
    } catch (error) {
      return data;
    }
  },
});

export default WIDGETS;