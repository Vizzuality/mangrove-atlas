import { ReactElement, useMemo, useCallback } from 'react';

import Image from 'next/image';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { INFO } from 'containers/datasets';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'components/ui/dialog';
import { Icon } from 'components/ui/icon';
import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/ui/switch';
import type { ActiveLayers } from 'types/layers';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

import INFO_SVG from 'svgs/ui/info.svg?sprite';
import { trackEvent } from 'lib/analytics/ga';

type SuggestionTypes = {
  origin?: WidgetSlugType; // Optional prop to track the origin of the suggestion
  name: string;
  id: ContextualBasemapsId | WidgetSlugType | 'hi-res-extent';
  description: string;
  children?: ReactElement;
  color?: string;
  thumbSource?: string;
};

const SuggestedLayers = ({
  origin,
  children,
  name,
  id,
  description,
  color,
  thumbSource,
}: SuggestionTypes) => {
  const Info = INFO[id];
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const activeLayersIds = activeLayers?.map((l) => l.id);
  const isActive = useMemo(() => activeLayersIds?.includes(id), [activeLayersIds, id]);

  const handleClick = useCallback(() => {
    const layersUpdate = isActive
      ? activeLayers?.filter((w) => w.id !== id)
      : ([{ id, opacity: '1', visibility: 'visible' }, ...activeLayers] as ActiveLayers[]);

    if (!isActive) {
      // Google Analytics tracking
      trackEvent(`Suggested layer - ${id}`, {
        action: 'add suggested contextual layer',
        label: `Suggested Contextual Layer - ${id}. From: ${origin}`,
      });
    }
    setActiveLayers(layersUpdate);
  }, [isActive, activeLayers, setActiveLayers, id]);

  // const handleClick = () => {
  //   const updatedContextualBasemap = basemapContextualSelected === id ? null : id;
  //   setBasemapContextual({ id: updatedContextualBasemap, opacity: 1, visibility: 'visible' });
  // };

  return (
    <div className="flex flex-col space-y-5 rounded-xl bg-black bg-opacity-[4%] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!!thumbSource && (
            <div className="relative h-[42px] w-[42px] shrink-0 rounded-2xl">
              <Image
                fill={true}
                quality={100}
                style={{ objectFit: 'cover' }}
                className="rounded-xl"
                src={thumbSource}
                alt={name}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          {color && (
            <div className="h-[42px] w-[42px] rounded-2xl" style={{ backgroundColor: color }} />
          )}
          <p className="text-sm font-light">{description}</p>
        </div>
        <div className="flex items-start space-x-2">
          <Dialog>
            <DialogTrigger>
              <Icon icon={INFO_SVG} className="h-7.5 w-7.5 text-brand-800" description="Info" />
            </DialogTrigger>
            <DialogContent className="w-screen md:mb-20 md:w-auto">
              <div className="no-scrollbar overflow-y-auto">
                <Info />
              </div>
              <DialogClose className="md:0 -top-2 md:absolute" />
            </DialogContent>
          </Dialog>

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
