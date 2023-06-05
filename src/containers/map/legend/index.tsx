import { useCallback } from 'react';

import widgets from 'containers/widgets/constants';

import Icon from 'components/icon';
import { WidgetSlugType } from 'types/widget';

import REMOVE_SVG from 'svgs/remove.svg?sprite';

const Legend = ({
  layers,
  setActiveWidgets,
}: {
  layers: readonly WidgetSlugType[];
  setActiveWidgets: (layers: WidgetSlugType[]) => void;
}) => {
  const removeLayer = useCallback(
    (layer: string) => {
      const updatedLayers = layers.filter((l) => {
        return l !== layer;
      });
      setActiveWidgets(updatedLayers);
    },
    [layers, setActiveWidgets]
  );

  const widgetName = (label) => {
    return widgets.find((w) => w.slug === label)?.name;
  };

  return (
    <div className="flex flex-col space-y-1">
      {!!layers.length &&
        layers.map((l) => (
          <div
            key={l}
            className="flex h-11 items-center justify-between rounded-md bg-white px-6 py-3 text-sm shadow-medium"
          >
            <p className="text-xs font-semibold uppercase">{widgetName(l)}</p>
            <button onClick={() => removeLayer(l)}>
              <Icon icon={REMOVE_SVG} className="h-5 w-5" />
            </button>
          </div>
        ))}
    </div>
  );
};

export default Legend;
