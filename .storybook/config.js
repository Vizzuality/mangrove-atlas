import { configure } from "@storybook/react";
import '@storybook/addon-knobs/register';


function requireAll(requireContext) {
  return requireContext.keys().map(requireContext)
}

function loadStories() {
  requireAll(require.context("../src/components", true, /.stories\.jsx?$/));
}

configure(loadStories, module)
