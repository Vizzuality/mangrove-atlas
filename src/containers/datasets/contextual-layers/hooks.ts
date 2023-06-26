import widgets from 'containers/widgets/constants';

import { WidgetSlugType } from 'types/widget';

export const useContextualLayer = (s: WidgetSlugType): string[] =>
  widgets.find(({ slug }) => slug === s)?.contextualLayersIds;
