import { PropsWithChildren, useCallback } from 'react';

import { widgetsCollapsedAtom } from '@/store/widgets';

import { useAtom } from 'jotai';

import { WidgetSlugType } from 'types/widget';

type HeaderProps = {
  id: WidgetSlugType;
  title: string;
  /**
   * Card-level collapse state. The wrapper passes it because it also factors in the drawing tools,
   * which force a widget open; sub-section headers inside a card omit it and read the atom.
   */
  isCollapsed?: boolean;
};

const WidgetHeader = ({ title, id, isCollapsed, children }: PropsWithChildren<HeaderProps>) => {
  const [widgetsCollapsed, setWidgetsCollapsed] =
    useAtom<Record<string, boolean>>(widgetsCollapsedAtom);

  const collapsed = isCollapsed ?? !!widgetsCollapsed[id];

  const handleWidgetCollapsed = useCallback(() => {
    const updatedWidgetsCollapsed = {
      ...widgetsCollapsed,
      [id]: !widgetsCollapsed[id],
      ['mangrove_drawing_tool']: false,
      ['mangrove_drawing_upload_tool']: false,
    };
    setWidgetsCollapsed(updatedWidgetsCollapsed);
  }, [id, widgetsCollapsed, setWidgetsCollapsed]);

  return (
    <header className="flex items-center justify-between">
      <h2 id={`widget-${id}-title`} className="flex min-w-0 flex-1">
        <button
          type="button"
          onClick={handleWidgetCollapsed}
          aria-expanded={!collapsed}
          aria-controls={`widget-${id}-content`}
          className="focus-visible:ring-brand-800 flex-1 cursor-pointer rounded text-left text-xs font-bold -tracking-tighter text-black/85 uppercase focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {title}
        </button>
      </h2>

      {children}
    </header>
  );
};

export default WidgetHeader;
