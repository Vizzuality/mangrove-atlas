import { useState } from 'react';

import SortableList from '@/components/map/legend/sortable/list';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import LegendItem from '../item';
import { useLegendLayers } from '../use-legend-layers';

const PANEL_STYLE = 'shadow-medium rounded-3xl border border-black/10 bg-white';

const Legend = () => {
  const { legendLayers, handleChangeOrder } = useLegendLayers();
  const [isOpen, setIsOpen] = useState(true);

  if (!legendLayers?.length) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-screen flex-col items-center gap-2"
    >
      <CollapsibleTrigger
        className={`${PANEL_STYLE} group hover:bg-grey-50 flex w-90 cursor-pointer items-center justify-between px-4 py-3 transition-colors`}
      >
        <p className="text-xs font-bold whitespace-nowrap text-black/85 uppercase opacity-85">
          <span className="group-data-[state=open]:hidden">Show legend</span>
          <span className="group-data-[state=closed]:hidden">Hide legend</span>
        </p>
      </CollapsibleTrigger>

      <CollapsibleContent
        className={`${PANEL_STYLE} data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down w-90 overflow-hidden`}
      >
        <div className="box-content flex max-h-[calc(100vh-266px)] flex-col overflow-y-auto p-4">
          <SortableList
            onChangeOrder={handleChangeOrder}
            sortable={{ handle: true, enabled: true }}
          >
            {legendLayers.map((layer) => (
              <LegendItem id={layer.id} key={layer.id} l={layer} />
            ))}
          </SortableList>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Legend;
