import { createContext, useContext } from 'react';

export const WidgetIdContext = createContext<string | null>(null);

/** `widget-<slug>-title` — the id of the current card's <h2>, if inside one. */
export function useWidgetTitleId(): string | null {
  const id = useContext(WidgetIdContext);
  return id ? `widget-${id}-title` : null;
}
