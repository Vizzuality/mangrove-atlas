import { useCallback, useEffect, useMemo } from 'react';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { updateLayers } from 'hooks/layers';

import { SwitchRoot, SwitchThumb, SwitchWrapper } from 'components/ui/switch';
import WidgetControls from 'components/widget-controls';
import type { ActiveLayers } from 'types/layers';

import { DATA_SOURCES } from '../constants';

import IndicatorExtent from './extent';
import IndicatorSource from './source';
import type { IndicatorSourcesTypes } from './types';
import IndicatorYear from './year';

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
}: IndicatorSourcesTypes) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const activeLayersIds = activeLayers?.map((l) => l.id);

  const isActive = useMemo(
    () => activeLayersIds.some((layerId) => layerId.startsWith('mangrove_national_dashboard')),
    [activeLayersIds]
  );

  const compareNationalLayers = activeLayersIds?.includes(id);

  useEffect(() => {
    if (isActive && !compareNationalLayers) {
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
            source_layer: dataSource.source_layer || DATA_SOURCES[dataSource.layer_link],
          },
        },
        activeLayers
      );
      setActiveLayers(layersUpdate);
    }
  }, [compareNationalLayers]);

  const handleClick = useCallback(() => {
    const layersUpdate = isActive
      ? activeLayers?.filter((w) => !w.id.includes('mangrove_national_dashboard_layer'))
      : ([
          ...activeLayers,
          {
            id,
            opacity: '1',
            visibility: 'visible',
            settings: {
              name: source,
              location: locationIso,
              layerIndex,
              source: dataSource.layer_link,
              source_layer: dataSource.source_layer || DATA_SOURCES[dataSource.layer_link],
            },
          },
        ] as ActiveLayers[]);

    setActiveLayers(layersUpdate);
  }, [activeLayers, setActiveLayers, id, dataSource, isActive, layerIndex, locationIso, source]);

  return (
    <div key={source} className="flex w-full items-start justify-between space-x-4 py-4">
      <IndicatorSource source={source} color={color} />
      <IndicatorYear yearSelected={yearSelected} setYearSelected={setYearSelected} years={years} />
      <IndicatorExtent unit={unit} dataSource={dataSource} />

      <div className="flex min-h-min justify-end space-x-2">
        <WidgetControls
          content={{
            link: dataSource?.download_link,
            description: dataSource?.layer_info,
            name: source,
          }}
        />
        <SwitchWrapper id={id}>
          <SwitchRoot id={id} onClick={handleClick} checked={isActive}>
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>
    </div>
  );
};

export default IndicatorSources;
