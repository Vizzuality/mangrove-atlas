import { handleExpiredSession } from '@/lib/auth/expired-session';

import axios, { AxiosError, type AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

// A 401 on a request we sent with a bearer token means the backend token is
// no longer valid (logged-out requests carry no token, so they're unaffected).
function logoutOnExpiredToken(instance: AxiosInstance) {
  instance.interceptors.response.use(undefined, (error: AxiosError) => {
    const sentToken = !!error.config?.headers?.Authorization;
    if (error.response?.status === 401 && sentToken) void handleExpiredSession();
    return Promise.reject(error);
  });
}

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = (session as any)?.user?.accessToken;

  config.headers = config.headers ?? new axios.AxiosHeaders();
  (config.headers as any).Authorization = token ? `Bearer ${token}` : undefined;

  return config;
});
logoutOnExpiredToken(API);

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
  baseURL: `${process.env.NEXT_PUBLIC_AUTH_URL}`,
  headers: { 'Content-Type': 'application/json' },
});

AuthAPI.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = (session as any)?.user?.accessToken;

  config.headers = config.headers ?? new axios.AxiosHeaders();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);

  return config;
});
logoutOnExpiredToken(AuthAPI);

export default API;
