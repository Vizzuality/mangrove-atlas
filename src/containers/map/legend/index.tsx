/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useEffect } from 'react';

import { activeLayersAtom } from 'store/map';

import { useSetRecoilState, useRecoilState } from 'recoil';

import Icon from 'components/icon';

import REMOVE_SVG from 'svgs/remove.svg?sprite';

const Legend = () => {
  const [activeLayers] = useRecoilState(activeLayersAtom);
  const setActiveLayers = useSetRecoilState(activeLayersAtom);

  useEffect(() => {
    setActiveLayers(activeLayers);
  }, [activeLayers, setActiveLayers]);

  const updateLayers = useCallback(
    (layer: string) => {
      const updatedLayers = activeLayers.filter((l) => {
        return l !== layer;
      });

      setActiveLayers(updatedLayers);
    },
    [activeLayers, setActiveLayers]
  );

  return (
    <div className="mb-1 flex flex-col space-y-1">
      {!!activeLayers.length &&
        activeLayers.map((layer) => (
          <div
            key={layer}
            className="flex h-11 items-center justify-between rounded-md bg-white px-4 py-3 text-sm shadow-medium"
          >
            <p className="text-xs font-semibold uppercase">{layer}</p>
            <button onClick={() => updateLayers(layer)}>
              <Icon icon={REMOVE_SVG} className="h-4 w-4" />
            </button>
          </div>
        ))}
    </div>
  );
};

export default Legend;
