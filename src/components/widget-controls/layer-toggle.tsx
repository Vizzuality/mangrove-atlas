import { useCallback, useMemo } from 'react';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { updateLayers } from 'hooks/layers';

import Helper from 'containers/help/helper';

import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/ui/switch';
import type { WidgetSlugType } from 'types/widget';
import { HELPER_POSITION } from './constants';

type WidgetControlsType = Readonly<{
  id?: WidgetSlugType;
}>;

const LayerToggle = ({ id }: WidgetControlsType) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const activeLayersIds = activeLayers?.map((l) => l.id);

  const isActive = useMemo(() => {
    // Check if the id is included in activeLayersIds
    const isCurrentlyActive = activeLayersIds?.includes(id);

    // Check if any id in activeLayersIds starts with 'national_dashboard'
    const isAnyActiveNationalDashboard =
      id?.startsWith('mangrove_national_dashboard') &&
      activeLayersIds.some((layerId) => layerId.startsWith('mangrove_national_dashboard'));

    // Returns true if the current id is 'national_dashboard' and it is active,
    // or if the id is not 'national_dashboard' but some id in activeLayersIds is
    return isCurrentlyActive || isAnyActiveNationalDashboard;
  }, [activeLayersIds, id]);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
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
      <SwitchWrapper id={id}>
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
