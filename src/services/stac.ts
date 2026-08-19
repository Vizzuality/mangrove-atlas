import axios from 'axios';

export const StacIndexAPI = axios.create({
  baseURL: 'https://stacindex.org/api',
  headers: { 'Content-Type': 'application/json' },
});

// Catalog nodes live on arbitrary hosts (S3 buckets, STAC API servers), so no baseURL.
export const StacAPI = axios.create({
  headers: { 'Content-Type': 'application/json' },
});
