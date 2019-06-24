import React from 'react';
import PropTypes from 'prop-types';

// todo: add Universal component or loadable
import AppPage from 'pages/app';
import NotFoundPage from 'pages/not-found';

const pageMap = new Map([
  ['APP', AppPage],
  ['COUNTRY', AppPage],
  ['AOI', AppPage],
  ['WDPA', AppPage]
]);

// prompts or error logging should be handled here
const Pages = ({ page: { current, payload } }) => {
  const Page = pageMap.has(current) ? pageMap.get(current) : NotFoundPage;

  return <Page {...payload} />;
};

Pages.propTypes = {
  page: PropTypes.shape({
    current: PropTypes.string.isRequired,
    payload: PropTypes.shape({}).isRequired
  }).isRequired
};

export default Pages;
