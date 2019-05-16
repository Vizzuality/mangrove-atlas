import React from 'react'

// todo: add Universal component or loadable

const pageMap = new Map([
  ['home', 'home']
]);

// prompts or error logging should be handled here
const Layout = ({ page }) => <div page={pageMap.has(page) ? pageMap.get(page) : 'not-found'} />;

export default Layout;
