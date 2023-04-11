import { useState } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

const CollapsibleDemo = () => {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root className="w-[300px]" defaultOpen={true} open={open} onOpenChange={setOpen}>
      <div
        className="relative"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Collapsible.Trigger asChild>
          <button className="drop-shadow-[0px 4px 12px  0px #00000014] focus:drop-shadow-[0px  4px  12px  0px #00000014x]  text-color-black absolute bottom-0 -right-8 inline-flex h-[25px] w-[25px] items-center justify-center rounded-lg font-bold outline-none drop-shadow-lg">
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </Collapsible.Trigger>
      </div>

      <div className="shadow-blackA7 rounded bg-white p-[10px] shadow-[0_2px_10px]">
        <span className="text-violet11 text-[15px] leading-[25px]">Layers</span>
      </div>

      <Collapsible.Content>
        <div className="shadow-blackA7 my-[10px] rounded bg-white p-[10px] shadow-[0_2px_10px]">
          <span className="text-violet11 text-[15px] leading-[25px]">Layer 1</span>
        </div>
        <div className="shadow-blackA7 my-[10px] rounded bg-white p-[10px] shadow-[0_2px_10px]">
          <span className="text-violet11 text-[15px] leading-[25px]">Layer 2</span>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleDemo;
