import { useCallback, useEffect, useMemo } from 'react';

import { trackEvent } from '@/lib/analytics/ga';

import { activeLayersAtom } from '@/store/layers';

import { useRecoilState } from 'recoil';

import { SwitchRoot, SwitchThumb, SwitchWrapper } from '@/components/ui/switch';
import WidgetControls from '@/components/widget-controls';
import type { Layer } from 'types/layers';

import IndicatorExtent from './extent';
import IndicatorSource from './source';
import type { IndicatorSourcesProps } from './types';
import IndicatorYear from './year';

const NATIONAL_LAYER_ID = 'mangrove_national_dashboard_layer';

const IndicatorSources = ({
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
    () => `${NATIONAL_LAYER_ID}_${locationIso}` as `mangrove_national_dashboard_layer_${string}`,
    [locationIso]
  );

  const isNationalLayerActive = useMemo(
    () => (activeLayers ?? []).some((layer) => layer.id === layerId),
    [activeLayers, layerId]
  );

  const buildLayer = useCallback(
    (): Layer => ({
      id: layerId,
      opacity: '1',
      visibility: 'visible',
      settings: {
        name: source,
        location: locationIso,
        layerIndex,
        source: dataSource.layer_link,
        source_layer: dataSource.source_layer,
        year: yearSelected,
      },
    }),
    [
      layerId,
      source,
      locationIso,
      layerIndex,
      dataSource.layer_link,
      dataSource.source_layer,
      yearSelected,
    ]
  );

  const isNationalLayer = useCallback((id: Layer['id']) => {
    return typeof id === 'string' && id.startsWith(`${NATIONAL_LAYER_ID}_`);
  }, []);

  const replaceNationalLayer = useCallback(
    (layers: Layer[] = []): Layer[] => {
      const nextLayer = buildLayer();
      const withoutNationalLayers = layers.filter((layer) => !isNationalLayer(layer.id));

      return [nextLayer, ...withoutNationalLayers];
    },
    [buildLayer, isNationalLayer]
  );

  const updateCurrentLayer = useCallback(
    (layers: Layer[] = []): Layer[] =>
      layers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              settings: {
                ...layer.settings,
                name: source,
                location: locationIso,
                layerIndex,
                source: dataSource.layer_link,
                source_layer: dataSource.source_layer,
                year: yearSelected,
              },
            }
          : layer
      ),
    [
      layerId,
      source,
      locationIso,
      layerIndex,
      dataSource.layer_link,
      dataSource.source_layer,
      yearSelected,
    ]
  );

  useEffect(() => {
    if (!isNationalLayerActive) return;

    setActiveLayers((prev) => updateCurrentLayer(prev ?? []));
  }, [isNationalLayerActive, updateCurrentLayer, setActiveLayers]);

  const handleClick = useCallback(() => {
    setActiveLayers((prev) => {
      const prevLayers = prev ?? [];

      if (prevLayers.some((layer) => layer.id === layerId)) {
        return prevLayers.filter((layer) => layer.id !== layerId);
      }

      return replaceNationalLayer(prevLayers);
    });

    if (!isNationalLayerActive) {
      trackEvent(`Add mangrove national dashboard indicator layer - ${locationIso}`, {
        category: 'Layers',
        action: 'Toggle',
        label: `Add mangrove national dashboard indicator layer - ${locationIso}`,
      });
    }
  }, [setActiveLayers, layerId, replaceNationalLayer, isNationalLayerActive, locationIso]);

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
          <SwitchRoot id={layerId} onClick={handleClick} checked={isNationalLayerActive}>
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>
    </div>
  );
};

export default IndicatorSources;
