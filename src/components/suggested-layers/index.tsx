import { ReactElement, useMemo, useCallback } from 'react';

import Image from 'next/image';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import type { ActiveLayers } from 'types/layers';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

type SuggestionTypes = {
  name: string;
  id: ContextualBasemapsId | WidgetSlugType;
  description: string;
  children?: ReactElement;
  color?: string;
  thumbSource?: string;
};

const SuggestedLayers = ({
  children,
  name,
  id,
  description,
  color,
  thumbSource,
}: SuggestionTypes) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const activeLayersIds = activeLayers.map((l) => l.id);
  const isActive = useMemo(() => activeLayersIds.includes(id), [activeLayersIds, id]);

  const handleClick = useCallback(() => {
    const layersUpdate = isActive
      ? activeLayers.filter((w) => w.id !== id)
      : ([{ id, opacity: '1', visibility: 'visible' }, ...activeLayers] as ActiveLayers[]);
    setActiveLayers(layersUpdate);
  }, [isActive, activeLayers, setActiveLayers, id]);

  // const handleClick = () => {
  //   const updatedContextualBasemap = basemapContextualSelected === id ? null : id;
  //   setBasemapContextual({ id: updatedContextualBasemap, opacity: 1, visibility: 'visible' });
  // };

  return (
    <div className="flex flex-col space-y-4 rounded-xl bg-black bg-opacity-[4%] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!!thumbSource && (
            <div className="relative h-[42px] w-[42px] shrink-0 rounded-2xl">
              <Image
                fill={true}
                quality={100}
                style={{ objectFit: 'cover' }}
                className="rounded-xl"
                src={thumbSource}
                alt={name}
              />
            </div>
          )}
          {color && (
            <div className="h-[42px] w-[42px] rounded-2xl" style={{ backgroundColor: color }} />
          )}
          <p className="text-sm">{description}</p>
        </div>
        <div className="flex items-start space-x-2">
          <SwitchWrapper id={id}>
            <SwitchRoot onClick={handleClick} defaultChecked={isActive} checked={isActive}>
              <SwitchThumb />
            </SwitchRoot>
          </SwitchWrapper>
        </div>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default SuggestedLayers;
