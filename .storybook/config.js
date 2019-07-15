// import { configure } from '@storybook/react';

// function loadStories() {
//   require('../src/stories/index.js');
//   // You can require as many stories as you need.
// }

// configure(loadStories, module);

import { configure } from "@storybook/react"


function requireAll(requireContext) {
  return requireContext.keys().map(requireContext)
}

function loadStories() {
  requireAll(require.context("../src/components", true, /.stories\.jsx?$/));
}

configure(loadStories, module)
