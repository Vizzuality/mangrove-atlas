import { NOT_FOUND } from 'redux-first-router';

export const PAGES = [
  {
    name: 'APP',
    path: '/',
    page: 'app',
  },
  {
    name: NOT_FOUND,
    path: '/404',
    page: 'not-found'
  }
];

export default PAGES;
