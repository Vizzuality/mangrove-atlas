
import axios from 'axios';

const UPLOAD = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/v2/spatial_file/converter`,
  headers: { 'Content-Type': 'application/json' },
});

export default UPLOAD;