import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v2`,
  headers: { 'Content-Type': 'application/json' },
});

export const AnalysisAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ANALYSIS_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default API;
