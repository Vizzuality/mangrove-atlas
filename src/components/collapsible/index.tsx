import { useCallback, useState } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronUpIcon } from '@radix-ui/react-icons';
import cn from 'classnames';

import BasemapSelector from 'containers/map/basemap-selector';
import widgets from 'containers/widgets/constants';

import Icon from 'components/icon';
import { WidgetSlugType } from 'types/widget';

import REMOVE_SVG from 'svgs/remove.svg?sprite';

const CollapsibleComponent = ({
  layers,
  setActiveWidgets,
}: {
  layers: readonly WidgetSlugType[];
  setActiveWidgets: (layers: WidgetSlugType[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const removeLayer = useCallback(
    (layer: WidgetSlugType) => {
      const updatedLayers = layers.filter((l) => {
        return l !== layer;
      });
      setActiveWidgets(updatedLayers);
    },
    [layers, setActiveWidgets]
  );

  const widgetName = (label) => {
    return widgets.find((w) => w.slug === label).name;
  };

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="w-screen space-y-2 px-6">
      <div className="flex w-full items-center justify-between">
        <div className="h-11 w-10/12 rounded-lg border bg-white py-3 px-4 shadow-light">
          {(!isOpen || !layers.length) && <p className="text-xs font-semibold uppercase">Layer</p>}
          {isOpen && !!layers.length && (
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase">{widgetName(layers[0])}</p>
              <button onClick={() => removeLayer(layers[0])}>
                <Icon icon={REMOVE_SVG} className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <Collapsible.Trigger asChild>
          <button className="flex h-11 w-11 items-center justify-center rounded-lg border bg-white shadow-light">
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
              <p className="text-xs font-semibold uppercase">{widgetName(l)}</p>
              <button onClick={() => removeLayer(l)}>
                <Icon icon={REMOVE_SVG} className="h-4 w-4" />
              </button>
            </div>
          );
        })}
        <BasemapSelector />
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleComponent;
