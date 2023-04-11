import { useState } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronUpIcon } from '@radix-ui/react-icons';

const CollapsibleDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Layer</h4>
        <Collapsible.Trigger asChild>
          <button className="w-9 p-0">
            <ChevronUpIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content className="space-y-2">
        <div className="rounded-md border border-slate-200 px-4 py-3 font-mono text-sm dark:border-slate-700">
          Layer 1
        </div>
        <div className="rounded-md border border-slate-200 px-4 py-3 font-mono text-sm dark:border-slate-700">
          Layer 2
        </div>
        <div className="rounded-md border border-slate-200 px-4 py-3 font-mono text-sm dark:border-slate-700">
          Layer 3
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleDemo;
