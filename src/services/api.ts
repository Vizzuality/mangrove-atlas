import axios from 'axios';
import { getSession } from 'next-auth/react';

const API = axios.create({
  baseURL: `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL_STAGING : process.env.NEXT_PUBLIC_API_URL_STAGING}/api/v2`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
});

API.interceptors.request.use(async (config) => {
  const session = await getSession();
  const accessToken = (session as any)?.user?.accessToken;

  if (accessToken) {
    config.headers = config.headers ?? new axios.AxiosHeaders();
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
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

export const NextAPI = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const AuthAPI = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_AUTH_URL}/users`,
  headers: { 'Content-Type': 'application/json' },
});

export default API;
