import { useCallback } from 'react';

import Helper from 'containers/guide/helper';
import { LAYERS } from 'containers/layers/constants';

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

  const layerName = (label) => {
    return LAYERS.find((w) => w.id === label)?.name;
  };

  const HELPER_ID = layers[0];

  return (
    <div className="flex flex-col space-y-1 print:hidden">
      {!!layers.length &&
        layers.map((l) => (
          <Helper
            key={l}
            className={{
              button: l === HELPER_ID ? '-bottom-3.5 -left-1.5 z-[20]' : 'hidden',
              tooltip: 'w-[236px]',
            }}
            tooltipPosition={{ top: 80, left: 0 }}
            message="List of legends seen on the map. You can close them directly here"
          >
            <div className="flex h-11 min-w-[270px] items-center justify-between rounded-md bg-white px-6 py-3 text-sm shadow-medium">
              <p className="text-xs font-semibold uppercase">{layerName(l)}</p>
              <button onClick={() => removeLayer(l)}>
                <Icon icon={REMOVE_SVG} className="h-5 w-5" />
              </button>
            </div>
          </Helper>
        ))}
    </div>
  );
};

export default Legend;
