/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useEffect } from 'react';

import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import { useActiveLayers } from 'containers/layers/hooks';

import Icon from 'components/icon';

import REMOVE_SVG from 'svgs/remove.svg?sprite';

const Legend = () => {
  const [activeLayersSlugs, setActiveLayers] = useRecoilState(activeWidgetsAtom);

  useEffect(() => {
    setActiveLayers(activeLayersSlugs);
  }, [activeLayersSlugs, setActiveLayers]);

  const updateLayers = useCallback(
    (layer: string) => {
      const updatedLayers = activeLayersSlugs.filter((l) => {
        return l !== layer;
      });

      setActiveLayers(updatedLayers);
    },
    [activeLayersSlugs, setActiveLayers]
  );
  const activeLayers = useActiveLayers(activeLayersSlugs);

  return (
    <div className="mb-1 flex flex-col space-y-1">
      {!!activeLayers.length &&
        activeLayers.map((layer) => (
          <div
            key={layer}
            className="flex h-11 items-center justify-between rounded-md bg-white px-6 py-3 text-sm shadow-medium"
          >
            <p className="text-xs font-semibold uppercase">{layer}</p>
            <button onClick={() => updateLayers(layer)}>
              <Icon icon={REMOVE_SVG} className="h-5 w-5" />
            </button>
          </div>
        ))}
    </div>
  );
};

export default Legend;
