import { NOT_FOUND, redirect } from 'redux-first-router';

export const PAGES = [
  {
    name: 'HOME',
    path: '/',
    page: 'home',
    thunk: dispatch => dispatch(redirect({ type: 'LOCATION' }))
  },
  {
    name: 'LOCATION',
    path: '/location/:type?/:id?',
    page: 'location'
  },
  {
    name: NOT_FOUND,
    path: '/404',
    page: 'not-found'
  }
];

export default PAGES;
