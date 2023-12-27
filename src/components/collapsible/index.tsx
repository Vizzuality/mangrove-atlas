import { useCallback, useState } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronUpIcon } from '@radix-ui/react-icons';
import cn from 'classnames';
import type { Visibility } from 'mapbox-gl';

import { LAYERS } from 'containers/layers/constants';

import Icon from 'components/icon';
import { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

import REMOVE_SVG from 'svgs/ui/close.svg?sprite';

const CollapsibleComponent = ({
  layers,
  setActiveLayers,
}: {
  layers: readonly (WidgetSlugType & ContextualBasemapsId & 'custom-area')[];
  setActiveLayers: (layers: (WidgetSlugType & ContextualBasemapsId & 'custom-area')[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const removeLayer = useCallback(
    (layer: WidgetSlugType | ContextualBasemapsId | 'custom-area') => {
      const updatedLayers = layers.filter((l) => {
        return l !== layer;
      });
      setActiveLayers(updatedLayers);
    },
    [layers, setActiveLayers]
  );

  const layerName = (label: { id: string; opacity: string; visibility: Visibility }): string => {
    const layer = LAYERS.find((w) => w.id === label.id);
    return layer ? layer.name : '';
  };

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="w-screen space-y-2 px-6">
      <div className="flex w-full items-center justify-between">
        <div className="h-11 w-10/12 rounded-lg border bg-white py-3 px-4 shadow-light">
          {(!isOpen || !layers.length) && <p className="text-xs font-semibold uppercase">Layer</p>}
          {isOpen && !!layers.length && (
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase">{layerName(layers[0])}</p>
              <button onClick={() => removeLayer(layers[0])} aria-label="remove-layer">
                <Icon icon={REMOVE_SVG} className="h-4 w-4" description="Cross" />
              </button>
            </div>
          )}
        </div>
        <Collapsible.Trigger asChild>
          <button
            aria-label="toggle collapsible component"
            className="flex h-11 w-11 items-center justify-center rounded-lg border bg-white shadow-light"
          >
            <ChevronUpIcon
              className={cn({
                'h-4 w-4': true,
                'rotate-180': isOpen,
              })}
            />
            <span className="sr-only">Toggle</span>
          </button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content className="w-10/12 space-y-2">
        {layers?.slice(1).map((l) => {
          return (
            <div
              key={l}
              className="flex h-11 items-center justify-between rounded-md border bg-white px-4 py-3 text-sm shadow-light"
            >
              <p className="text-xs font-semibold uppercase">{layerName(l)}</p>
              <button aria-label="remove-layer" onClick={() => removeLayer(l)}>
                <Icon icon={REMOVE_SVG} className="h-4 w-4" description="Cross" />
              </button>
            </div>
          );
        })}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleComponent;
