import { useMemo, useCallback } from 'react';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { INFO } from 'containers/datasets';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { Icon } from 'components/ui/icon';
import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/ui/switch';
import type { ActiveLayers } from 'types/layers';
import type { WidgetSlugType } from 'types/widget';

import INFO_SVG from 'svgs/ui/info.svg?sprite';
import { trackEvent } from 'lib/analytics/ga';

type ControlTypes = {
  id: string;
  origin?: WidgetSlugType; // Optional prop to track the origin of the suggestion
};

const Controls = ({ id, origin }: ControlTypes) => {
  const Info = INFO[id];
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const activeLayersIds = activeLayers?.map((l) => l.id);
  const isActive = useMemo(
    () => activeLayersIds?.includes(id as WidgetSlugType),
    [activeLayersIds, id]
  );

  const handleClick = useCallback(() => {
    const layersUpdate = isActive
      ? activeLayers?.filter((w) => w.id !== id)
      : ([{ id, opacity: '1', visibility: 'visible' }, ...activeLayers] as ActiveLayers[]);

    if (!isActive) {
      // Google Analytics tracking
      trackEvent(`Suggested layer - ${id}`, {
        action: 'Layers - Contextual',
        label: `Suggested Contextual Layer - ${id}. From: ${origin}`,
        value: origin,
      });
    }
    setActiveLayers(layersUpdate);
  }, [isActive, activeLayers, setActiveLayers, id]);

  return (
    <div className="flex items-start space-x-2">
      <Dialog>
        <DialogTrigger>
          <Icon icon={INFO_SVG} className="h-7.5 w-7.5 text-brand-800" description="Info" />
        </DialogTrigger>
        <DialogContent className="w-screen md:mb-20 md:w-auto">
          <DialogTitle className="sr-only">Info</DialogTitle>
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
  );
};

export default Controls;
