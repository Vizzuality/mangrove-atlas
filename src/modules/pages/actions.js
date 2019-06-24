import { createAction } from 'vizzuality-redux-tools';

import pages from './constants';

export const pageActions = pages.reduce(
  (acc, page) => ({ ...acc, [page.name]: createAction(`${page.name}`) }),
  {}
);

export default { pageActions };
