import axios from 'axios';

const API_cloud_functions = axios.create({
  baseURL: 'https://us-central1-mangrove-atlas-246414.cloudfunctions.net',
  headers: { 'Content-Type': 'application/json' },
});

export default API_cloud_functions;
