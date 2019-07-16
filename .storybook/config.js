import { configure } from "@storybook/react"


function requireAll(requireContext) {
  return requireContext.keys().map(requireContext)
}

function loadStories() {
  requireAll(require.context("../src/components", true, /.stories\.jsx?$/));
}

configure(loadStories, module)
