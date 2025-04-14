import { useMemo, useCallback, useEffect } from 'react';

import cn from 'lib/classnames';
import { numberFormat } from 'lib/format';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { updateLayers } from 'hooks/layers';

import Icon from 'components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/ui/switch';
import WidgetControls from 'components/widget-controls';
import { WIDGET_SELECT_STYLES, WIDGET_SELECT_ARROW_STYLES } from 'styles/widgets';
import type { ActiveLayers } from 'types/layers';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import { DATA_SOURCES } from '../constants';

import type { IndicatorSourceTypes } from './types';

const LABEL_UNITS = {
  km2: 'km²',
};

const IndicatorSource = ({
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
}: IndicatorSourceTypes) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const activeLayersIds = activeLayers?.map((l) => l.id);

  const isActive = useMemo(
    () => activeLayersIds.some((layerId) => layerId.startsWith('mangrove_national_dashboard')),
    [activeLayersIds]
  );

  const compareNationalLayers = activeLayersIds?.includes(id);

  useEffect(() => {
    if (isActive && !compareNationalLayers) {
      const layersUpdate = updateLayers(activeLayers, {
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
      });
      setActiveLayers(layersUpdate);
    }
  }, [compareNationalLayers]);

  const handleClick = useCallback(() => {
    const layersUpdate = isActive
      ? activeLayers?.filter((w) => !w.id.includes('mangrove_national_dashboard_layer'))
      : ([
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
          ...activeLayers,
        ] as ActiveLayers[]);

    setActiveLayers(layersUpdate);
  }, [activeLayers, setActiveLayers, id, dataSource, isActive, layerIndex, locationIso, source]);

  return (
    <div key={source} className="grid grid-cols-4 items-start justify-between space-x-2 py-4">
      <div className="col-span-1 flex space-x-2">
        <div style={{ backgroundColor: color }} className="mt-1 h-4 w-2 shrink-0 rounded-md pt-4" />

        <span className="max-w-[180px]">{source}</span>
      </div>
      <div className="col-span-1 flex">
        {years.length === 1 && <span>{years[0]}</span>}
        {years.length > 1 && (
          <Popover>
            <PopoverTrigger asChild>
              <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                {yearSelected}
                <Icon
                  icon={ARROW_SVG}
                  className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                  description="Arrow"
                />
              </span>
            </PopoverTrigger>

            <PopoverContent className="rounded-2xl px-2 shadow-border">
              <ul className="max-h-32 space-y-0.5">
                {years?.map((u) => (
                  <li key={u}>
                    <button
                      aria-label="set year"
                      className={cn({
                        'w-full rounded-lg py-1 px-2 text-left hover:bg-brand-800/20': true,
                        'hover:text-brand-800': yearSelected !== u,
                        'pointer-events-none opacity-50': yearSelected === u,
                      })}
                      type="button"
                      onClick={() => setYearSelected(u)}
                      disabled={yearSelected === u}
                    >
                      {u}
                    </button>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        )}
      </div>
      {dataSource?.value && (
        <span>
          {numberFormat(dataSource.value)}
          {unit && <span> {LABEL_UNITS[unit] || unit}</span>}
        </span>
      )}
      <div className="col-span-1 flex justify-end space-x-2">
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

export default IndicatorSource;
