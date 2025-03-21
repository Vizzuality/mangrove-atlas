import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v2`,
  headers: { 'Content-Type': 'application/json' },
});

export const STAGING_API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL_STAGING}/api/v2`,
  headers: { 'Content-Type': 'application/json' },
});

export const AnalysisAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ANALYSIS_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const BlogAPI = axios.create({
  baseURL: '/blog',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'max-age=3600',
  },
});

export const PlanetAPI = axios.create({
  baseURL: '/planet-api',
  headers: { 'Content-Type': 'application/json' },
});

export const ClimateWatchAPI = axios.create({
  baseURL: 'https://www.climatewatchdata.org/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export default API;
