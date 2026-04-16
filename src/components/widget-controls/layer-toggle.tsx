import { useCallback, useMemo } from 'react';

import { useSyncActiveLayers } from '@/store/layers';

import { updateLayers } from 'hooks/layers';

import Helper from '@/containers/help/helper';

import { SwitchRoot, SwitchThumb, SwitchWrapper } from '@/components/ui/switch';
import type { WidgetSlugType } from 'types/widget';

import { HELPER_POSITION } from './constants';

type WidgetControlsType = Readonly<{
  id?: WidgetSlugType;
}>;

const LayerToggle = ({ id }: WidgetControlsType) => {
  const [activeLayers, setActiveLayers] = useSyncActiveLayers();
  const activeLayersIds = activeLayers?.map((l) => l.id);

  const isActive = useMemo(() => {
    if (!id) return false;
    const isCurrentlyActive = activeLayersIds?.includes(id);
    const isAnyActiveNationalDashboard =
      id?.startsWith('mangrove_national_dashboard') &&
      activeLayersIds.some((layerId) => layerId.startsWith('mangrove_national_dashboard'));
    return isCurrentlyActive || isAnyActiveNationalDashboard;
  }, [activeLayersIds, id]);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (!id) return;
      const layersUpdate = updateLayers(
        {
          id,
          opacity: '1',
          visibility: isActive ? 'none' : 'visible',
        },
        activeLayers
      );
      setActiveLayers(layersUpdate);
    },
    [isActive, activeLayers, setActiveLayers, id]
  );

  if (!id) return null;

  const HELPER_ID = id === activeLayers?.[0]?.id;
  return (
    <Helper
      className={{
        button: HELPER_ID ? HELPER_POSITION : 'hidden',
        tooltip: 'w-fit-content max-w-[400px]',
      }}
      tooltipPosition={{ top: -35, left: 0 }}
      message="Use this icon to toggle the map layer on or off. If a widget does not have this icon, it means that there is no associated map layer."
    >
      <SwitchWrapper id={id as string}>
        <SwitchRoot
          data-testid={id}
          onClick={handleClick}
          defaultChecked={isActive}
          checked={isActive}
        >
          <SwitchThumb />
        </SwitchRoot>
      </SwitchWrapper>
    </Helper>
  );
};

export default LayerToggle;
