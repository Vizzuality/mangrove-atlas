import { connectRoutes } from 'redux-first-router';

import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';
import { PAGES } from 'modules/pages/constants';

const routes = PAGES.reduce((acc, page) => ({ ...acc, [page.name]: page.path }), {});

const options = {
  basename: process.env.REACT_APP_BASE_URL,
  location: 'router',
  notFoundPath: `${process.env.REACT_APP_BASE_URL}404`,
  querySerializer: {
    parse: decodeUrlForState,
    stringify: encodeStateForUrl
  },
  initialDispatch: false
};

export default connectRoutes(routes, options);
