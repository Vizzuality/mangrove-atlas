import { useCallback, useMemo, useEffect } from 'react';

import { trackEvent } from '@/lib/analytics/ga';

import { activeLayersAtom } from '@/store/layers';

import { useRecoilState } from 'recoil';

import { updateLayers } from 'hooks/layers';

import { SwitchRoot, SwitchThumb, SwitchWrapper } from '@/components/ui/switch';
import WidgetControls from '@/components/widget-controls';
import { WidgetSlugType } from '@/types/widget';
import type { ActiveLayers } from 'types/layers';

import IndicatorExtent from './extent';
import IndicatorSource from './source';
import type { IndicatorSourcesProps } from './types';
import IndicatorYear from './year';

const NATIONAL_PREFIX = 'mangrove_national_dashboard_layer';

const IndicatorSources = ({
  id,
  source,
  locationIso,
  layerIndex,
  years,
  unit,
  dataSource,
  color,
  yearSelected,
  setYearSelected,
}: IndicatorSourcesProps) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);

  const layerId = useMemo(
    () => `${NATIONAL_PREFIX}_${dataSource.source_layer}`,
    [dataSource.source_layer]
  ) as WidgetSlugType;

  const activeLayerIds = useMemo(() => (activeLayers ?? []).map((l) => l.id), [activeLayers]);

  const isAnyNationalActive = useMemo(
    () => activeLayerIds.some((x) => x.includes(NATIONAL_PREFIX)),
    [activeLayerIds]
  );

  const isThisLayerActive = useMemo(
    () => activeLayerIds.includes(layerId),
    [activeLayerIds, layerId]
  );

  useEffect(() => {
    if (!isThisLayerActive && isAnyNationalActive) {
      setActiveLayers((activeLayers ?? []).filter((w) => !w.id.includes(NATIONAL_PREFIX)));
    }
  }, [isThisLayerActive, isAnyNationalActive, setActiveLayers, activeLayers]);

  const upsertThisLayer = useCallback(() => {
    return updateLayers(
      {
        id: layerId,
        opacity: '1',
        visibility: 'visible',
        settings: {
          name: source,
          location: locationIso,
          layerIndex,
          source: dataSource.layer_link,
          source_layer: dataSource.source_layer,
        },
      },
      activeLayers ?? []
    );
  }, [
    activeLayers,
    dataSource.layer_link,
    dataSource.source_layer,
    layerId,
    layerIndex,
    locationIso,
    source,
  ]);

  const handleClick = useCallback(() => {
    const nextLayers: ActiveLayers[] = isAnyNationalActive
      ? (activeLayers ?? []).filter((w) => !w.id.includes(NATIONAL_PREFIX)) // ✅ consistent match
      : upsertThisLayer();

    if (!isAnyNationalActive) {
      trackEvent(`Add mangrove national dashboard indicator layer - ${layerId}`, {
        category: 'Layers',
        action: 'Toggle',
        label: `Add mangrove national dashboard indicator layer - ${layerId}`,
      });
    }

    setActiveLayers(nextLayers);
  }, [activeLayers, isAnyNationalActive, layerId, setActiveLayers, upsertThisLayer]);

  return (
    <div className="flex w-full items-start justify-between space-x-4 py-4">
      <IndicatorSource source={source} color={color} />
      <IndicatorYear yearSelected={yearSelected} setYearSelected={setYearSelected} years={years} />
      <IndicatorExtent unit={unit} dataSource={dataSource} />

      <div className="flex min-h-min justify-end space-x-2">
        <WidgetControls
          content={{
            link: dataSource.download_link ?? undefined,
            description: dataSource.layer_info,
            name: source,
          }}
        />
        <SwitchWrapper id={layerId}>
          <SwitchRoot id={layerId} onClick={handleClick} checked={isThisLayerActive}>
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>
    </div>
  );
};

export default IndicatorSources;
