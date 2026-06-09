import { findCategoryByWidgets } from '@/containers/widgets/utils';

describe('findCategoryByWidgets', () => {
  it('returns the category when the widgets exactly match it', () => {
    expect(
      findCategoryByWidgets([
        'mangrove_blue_carbon',
        'mangrove_emissions_mitigation',
        'mangrove_international_status',
      ])
    ).toBe('climate_and_policy');
  });

  it('ignores the widgets_deck_tool slug when matching', () => {
    expect(
      findCategoryByWidgets([
        'widgets_deck_tool',
        'mangrove_blue_carbon',
        'mangrove_emissions_mitigation',
        'mangrove_international_status',
      ])
    ).toBe('climate_and_policy');
  });

  it('falls back to all_datasets for a partial (incomplete) category', () => {
    expect(findCategoryByWidgets(['mangrove_blue_carbon'])).toBe('all_datasets');
  });

  it('falls back to all_datasets when widgets span multiple categories', () => {
    expect(findCategoryByWidgets(['mangrove_blue_carbon', 'mangrove_protected_areas'])).toBe(
      'all_datasets'
    );
  });

  it('falls back to all_datasets for empty input', () => {
    expect(findCategoryByWidgets([])).toBe('all_datasets');
  });
});
