import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// todo: add Universal component or loadable
import AppPage from 'pages/app';
import NotFoundPage from 'pages/not-found';

const pageMap = new Map([
  ['PAGE/APP', AppPage],
  ['PAGE/COUNTRY', AppPage],
  ['PAGE/AOI', AppPage],
  ['PAGE/WDPA', AppPage]
]);

// prompts or error logging should be handled here
const Pages = ({ page: { current }, initializeApp }) => {
  const Page = pageMap.has(current) ? pageMap.get(current) : NotFoundPage;

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return <Page page={current} />;
};

Pages.propTypes = {
  page: PropTypes.shape({
    current: PropTypes.string.isRequired,
    payload: PropTypes.shape({}).isRequired
  }).isRequired
};

export default Pages;
