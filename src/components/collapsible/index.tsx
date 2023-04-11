import { useState } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronUpIcon } from '@radix-ui/react-icons';
import cx from 'classnames';

const CollapsibleDemo = ({ layers }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="w-[400px] space-y-2">
      <div className="flex w-full items-center justify-between">
        <div className="h-11 w-[88%]  rounded-lg border bg-white py-3 px-4 shadow-light">
          <p className="text-xs font-semibold uppercase">{isOpen ? layers[0] : 'Layer'}</p>
        </div>
        <Collapsible.Trigger asChild>
          <button className="flex h-11 w-11 items-center justify-center rounded-lg border bg-white shadow-light">
            <ChevronUpIcon
              className={cx({
                'h-4 w-4': true,
                'rotate-180': isOpen,
              })}
            />
            <span className="sr-only">Toggle</span>
          </button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content className="w-[88%] space-y-2">
        {layers &&
          layers.slice(1).map((l: string, index: number) => {
            return (
              <div
                key={`component-key-${index}`}
                className="h-11 rounded-md border bg-white px-4 py-3 text-sm shadow-light"
              >
                <p className="text-xs font-semibold uppercase">{l}</p>
              </div>
            );
          })}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleDemo;
