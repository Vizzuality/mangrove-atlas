import React from 'react';
import PropTypes from 'prop-types';

// todo: add Universal component or loadable
import HomePage from 'pages/home';
import NotFoundPage from 'pages/not-found';

const pageMap = new Map([
  ['HOME', HomePage],
  ['LOCATION', HomePage]
]);


// prompts or error logging should be handled here
const Layout = ({ page: { current, payload } }) => {
  const Page = pageMap.has(current) ? pageMap.get(current) : NotFoundPage;

  return <Page {...payload} />;
};

Layout.propTypes = {
  page: PropTypes.shape({
    current: PropTypes.string.isRequired,
    payload: PropTypes.shape({}).isRequired
  }).isRequired
};

export default Layout;
