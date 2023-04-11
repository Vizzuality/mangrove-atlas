/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useState } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronUpIcon } from '@radix-ui/react-icons';
import cx from 'classnames';

import Icon from 'components/icon';

import REMOVE_SVG from 'svgs/remove.svg?sprite';

interface Layer {
  id: string;
  label: string;
}

const CollapsibleDemo = ({ layers }: { layers: Layer[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState<Layer[]>(layers);

  const removeLayer = useCallback(
    (id: string) => {
      const updatedLayers = selectedLayers.filter((l) => {
        return l.id !== id;
      });

      setSelectedLayers(updatedLayers);
    },
    [selectedLayers]
  );

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="w-[400px] space-y-2">
      <div className="flex w-full items-center justify-between">
        <div className="h-11 w-[88%]  rounded-lg border bg-white py-3 px-4 shadow-light">
          {(!isOpen || !selectedLayers.length) && (
            <p className="text-xs font-semibold uppercase">Layer</p>
          )}
          {isOpen && !!selectedLayers.length && (
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase">{selectedLayers[0].label}</p>
              <button onClick={() => removeLayer(selectedLayers[0].id)}>
                <Icon icon={REMOVE_SVG} className="h-4 w-4" />
              </button>
            </div>
          )}
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
        {selectedLayers.slice(1).map((l: Layer) => {
          return (
            <div
              key={l.id}
              className="flex h-11 items-center justify-between rounded-md border bg-white px-4 py-3 text-sm shadow-light"
            >
              <p className="text-xs font-semibold uppercase">{l.label}</p>
              <button onClick={() => removeLayer(l.id)}>
                <Icon icon={REMOVE_SVG} className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleDemo;
