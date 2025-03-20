import { WIDGETS_BY_CATEGORY } from 'containers/widgets/constants';

export function findCategoryByWidgets(widgets) {
  // Filter out enabledWidgets from the input widgets
  const filteredWidgets = widgets.filter((widget) => widget !== 'widgets_deck_tool');

  // Ensure filtered widgets are unique to avoid duplicate checks
  const widgetsSet = new Set(filteredWidgets);

  for (const cat of WIDGETS_BY_CATEGORY) {
    const [category, slugsCategory] = Object.entries(cat)[0];

    // Convert each category's widget array to a set for efficient lookup
    const slugsCategorySet = new Set(slugsCategory);

    // Check if every element in the category set is in the widgets set
    const isCategoryFullyInWidgets = [...slugsCategorySet].every((slug) => widgetsSet.has(slug));

    // Ensure that the input widgets set does not contain more items than the current category
    const areWidgetsOnlyFromCategory = [...widgetsSet].every((widget: string) =>
      slugsCategorySet.has(widget)
    );

    // Check for an exact match in terms of content and count
    if (isCategoryFullyInWidgets && areWidgetsOnlyFromCategory && category !== 'all_datasets') {
      return category;
    }
  }

  return 'all_datasets';
}
