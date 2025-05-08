import { PropsWithChildren, useCallback } from 'react';

import { widgetsCollapsedAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import { WidgetSlugType } from 'types/widget';

type HeaderProps = {
  id: WidgetSlugType;
  title: string;
};

const WidgetHeader = ({ title, id, children }: PropsWithChildren<HeaderProps>) => {
  const [widgetsCollapsed, setWidgetsCollapsed] =
    useRecoilState<Record<string, boolean>>(widgetsCollapsedAtom);

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
      <h2
        onClick={handleWidgetCollapsed}
        className="flex-1 cursor-pointer py-5 text-xs font-bold uppercase -tracking-tighter text-black/85 group-last-of-type:pointer-events-none"
      >
        {title}
      </h2>

      {children}
    </header>
  );
};

export default WidgetHeader;
