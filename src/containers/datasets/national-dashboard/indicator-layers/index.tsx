import { useCallback, useEffect, useMemo, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';

import { useSyncActiveLayers } from '@/store/layers';

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
  layerKey,
  indicator,
  years,
  unit,
  data_source,
  color,
}: IndicatorSourcesProps) => {
  const [activeLayers, setActiveLayers] = useSyncActiveLayers();
  const [yearSelected, setYearSelected] = useState<number>(years?.[years.length - 1]);

  const dataSource = useMemo(
    () => data_source.find((d) => d.year === yearSelected) ?? data_source[data_source.length - 1],
    [data_source, yearSelected]
  );

  const layerId = useMemo(
    () =>
      `${NATIONAL_LAYER_ID}_${locationIso}_${layerKey}` as `mangrove_national_dashboard_layer_${string}`,
    [locationIso, layerKey]
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
        source: dataSource?.layer_link,
        source_layer: dataSource?.source_layer,
        year: yearSelected,
      },
    }),
    [
      layerId,
      source,
      locationIso,
      layerIndex,
      dataSource?.layer_link,
      dataSource?.source_layer,
      yearSelected,
    ]
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
                source: dataSource?.layer_link,
                source_layer: dataSource?.source_layer,
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
      dataSource?.layer_link,
      dataSource?.source_layer,
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

      return [buildLayer(), ...prevLayers];
    });

    if (!isNationalLayerActive) {
      trackEvent(`Add mangrove national dashboard indicator layer - ${locationIso}`, {
        category: 'Layers',
        action: 'Toggle',
        label: `Add mangrove national dashboard indicator layer - ${locationIso} - ${source}`,
      });
    }
  }, [setActiveLayers, layerId, buildLayer, isNationalLayerActive, locationIso, source]);

  return (
    <div className="flex w-full items-start justify-between space-x-4 py-4">
      <IndicatorSource source={source} color={color} />
      <IndicatorYear yearSelected={yearSelected} setYearSelected={setYearSelected} years={years} />
      <IndicatorExtent unit={unit} dataSource={dataSource} />

      <div className="flex min-h-min justify-end space-x-2">
        <WidgetControls
          content={{
            link: dataSource?.download_link ?? '',
            description: dataSource?.layer_info ?? '',
            name: source,
          }}
        />
        <SwitchWrapper id={layerId}>
          <SwitchRoot
            id={layerId}
            onClick={handleClick}
            checked={isNationalLayerActive}
            aria-label={`Toggle ${source} ${indicator} layer`}
          >
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>
    </div>
  );
};

export default IndicatorSources;
