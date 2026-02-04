import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { activeLayersAtom } from 'store/layers';
import { updateLayers } from 'hooks/layers';
import type { ActiveLayers } from 'types/layers';

import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/ui/switch';
import WidgetControls from 'components/widget-controls';
import { trackEvent } from 'lib/analytics/ga';

import IndicatorExtent from './extent';
import IndicatorSource from './source';
import IndicatorYear from './year';
import type { IndicatorSourcesProps } from './types';
import { da } from 'date-fns/locale';

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
  const activeLayerIds = useMemo(() => (activeLayers ?? []).map((l) => l.id), [activeLayers]);

  const isAnyNationalActive = useMemo(
    () => activeLayerIds.some((layerId) => layerId.startsWith(NATIONAL_PREFIX)),
    [activeLayerIds]
  );

  const isThisLayerActive = useMemo(() => activeLayerIds.includes(id), [activeLayerIds, id]);

  useEffect(() => {
    if (!isThisLayerActive) return;

    const layersUpdate = updateLayers(
      {
        id,
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

    setActiveLayers(layersUpdate);
  }, [
    activeLayers,
    dataSource?.layer_link,
    dataSource?.source_layer,
    id,
    isThisLayerActive,
    layerIndex,
    locationIso,
    setActiveLayers,
    source,
  ]);

  const handleClick = useCallback(() => {
    const nextLayers: ActiveLayers[] = isAnyNationalActive
      ? (activeLayers ?? []).filter((w) => !w.id.startsWith(NATIONAL_PREFIX))
      : [
          ...(activeLayers ?? []),
          {
            id,
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
        ];

    if (!isAnyNationalActive) {
      trackEvent(`Add mangrove national dashboard indicator layer - ${id}`, {
        category: 'Layers',
        action: 'Toggle',
        label: `Add mangrove national dashboard indicator layer - ${id}`,
      });
    }

    setActiveLayers(nextLayers);
  }, [
    activeLayers,
    dataSource?.layer_link,
    dataSource?.source_layer,
    id,
    isAnyNationalActive,
    layerIndex,
    locationIso,
    setActiveLayers,
    source,
  ]);

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
        <SwitchWrapper id={id}>
          <SwitchRoot id={id} onClick={handleClick} checked={isThisLayerActive}>
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>
    </div>
  );
};

export default IndicatorSources;
