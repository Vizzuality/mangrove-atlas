import { createContext, useContext } from 'react';

/**
 * The slug of the widget card currently being rendered.
 *
 * Deep children (charts, legends) need to name themselves after the widget
 * they belong to. The alternative — threading a label prop through every
 * dataset's hooks and chart config — would touch ~20 widgets and drift the
 * moment a widget is renamed, since the card header already renders the
 * canonical title.
 */
export const WidgetIdContext = createContext<string | null>(null);

/** `widget-<slug>-title` — the id of the current card's <h2>, if inside one. */
export function useWidgetTitleId(): string | null {
  const id = useContext(WidgetIdContext);
  return id ? `widget-${id}-title` : null;
}
