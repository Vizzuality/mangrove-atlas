import React from 'react';

// todo: add Universal component or loadable
import HomePage from 'pages/home';
import NotFoundPage from 'pages/not-found';

const pageMap = new Map([
  ['HOME', HomePage]
]);


// prompts or error logging should be handled here
const Layout = ({ page }) => {
  const Page = pageMap.has(page) ? pageMap.get(page) : NotFoundPage;

  return <Page />;
};

export default Layout;