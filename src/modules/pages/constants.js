import { NOT_FOUND } from 'redux-first-router';

export const PAGES = [
  {
    name: 'APP',
    path: '/',
    page: 'app',
  },
  {
    name: 'COUNTRY',
    path: '/country/:iso',
    page: 'app',
  },
  {
    name: 'AOI',
    path: '/area-of-interest/:id',
    page: 'app',
  },
  {
    name: 'WDPA',
    path: '/protected-area/:id',
    page: 'app',
  },
  {
    name: NOT_FOUND,
    path: '/404',
    page: 'not-found'
  }
];

export default PAGES;
