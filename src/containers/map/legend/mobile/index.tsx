import { useState } from 'react';

import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { IconBaseProps } from 'react-icons/lib';

import SortableList from '@/components/map/legend/sortable/list';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import LegendItem from '../item';
import { useLegendLayers } from '../use-legend-layers';

const FaArrowDownIcon = FaArrowDown as unknown as (p: IconBaseProps) => JSX.Element;
const FaArrowUpIcon = FaArrowUp as unknown as (p: IconBaseProps) => JSX.Element;

const PANEL_STYLE = 'shadow-medium rounded-3xl border border-black/10 bg-white';

const Legend = () => {
  const { legendLayers, handleChangeOrder } = useLegendLayers();
  const [isOpen, setIsOpen] = useState(true);

  if (!legendLayers?.length) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col-reverse items-stretch gap-2"
    >
      <CollapsibleTrigger
        iconType={null}
        className={`${PANEL_STYLE} group hover:bg-grey-50 flex w-full cursor-pointer items-center justify-between px-4 py-3 transition-colors`}
      >
        <p className="text-xs font-bold whitespace-nowrap text-black/85 uppercase opacity-85">
          <span className="group-data-[state=open]:hidden">Show legend</span>
          <span className="group-data-[state=closed]:hidden">Hide legend</span>
        </p>
        <FaArrowUpIcon className="shrink-0 text-black/85 group-data-[state=open]:hidden" />
        <FaArrowDownIcon className="shrink-0 text-black/85 group-data-[state=closed]:hidden" />
      </CollapsibleTrigger>

      <CollapsibleContent
        className={`${PANEL_STYLE} data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down w-full overflow-hidden`}
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
