import { useMemo, useCallback } from 'react';
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import cn from 'lib/classnames';
import { numberFormat } from 'lib/format';

import { activeLayersAtom } from 'store/layers';

import { useRecoilState } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';

import Icon from 'components/icon';
import { Popover, PopoverContent, PopoverTrigger } from 'components/popover';
import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import WidgetControls from 'components/widget-controls';
import type { ActiveLayers } from 'types/layers';
import type { WidgetSlugType } from 'types/widget';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import { DATA_SOURCES } from '../constants';

const LABEL_UNITS = {
  km2: 'km²',
};

type DataSourceTypes = {
  value: number;
  layer_link: `globalmangrovewatch.${string}`;
  download_link: string;
  layer_info: string;
  source_layer: string;
};

type IndicatorSourceTypes = {
  id: WidgetSlugType;
  location: number;
  layerIndex: number;
  source: string;
  years: number[];
  unit: string;
  dataSource: DataSourceTypes;
  color: string;
  yearSelected: number;
  setYearSelected: (year: number) => void;
};

const IndicatorSource = ({
  id,
  source,
  location,
  layerIndex,
  years,
  unit,
  dataSource,
  color,
  yearSelected,
  setYearSelected,
}: IndicatorSourceTypes) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const activeLayersIds = activeLayers.map((l) => l.id);
  const isActive = useMemo(() => activeLayersIds.includes(id), [activeLayersIds, id]);
  const natDashLayer = useMemo(() => activeLayers.find((l) => l.id === id), [activeLayers, id]);
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const locationId = queryParams?.[1];
  const {
    data: { id: currentLocationId },
  } = useLocation(locationType, locationId);

  useEffect(() => {
    const isNationalDashboardActive = activeLayers.find(
      (layer) => layer.id === 'mangrove_national_dashboard_layer'
    );
    if (
      isNationalDashboardActive &&
      Number(location) !== isNationalDashboardActive.settings?.locationId
    ) {
      const updatedLayers = activeLayers.filter(
        (layer) => layer.id !== 'mangrove_national_dashboard_layer'
      );
      setActiveLayers(updatedLayers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(() => {
    const layersUpdate = isActive
      ? activeLayers.filter((w) => w.id !== id)
      : ([
          {
            id,
            opacity: '1',
            visibility: 'visible',
            settings: {
              name: source,
              locationId: location,
              layerIndex,
              source: dataSource.layer_link,
              source_layer: dataSource.source_layer || DATA_SOURCES[dataSource.layer_link],
            },
          },
          ...activeLayers,
        ] as ActiveLayers[]);
    setActiveLayers(layersUpdate);
  }, [activeLayers, setActiveLayers, id]);

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
              <span className="first-line:after relative cursor-pointer border-b-2 border-b-brand-800 font-bold">
                {yearSelected}
                <Icon
                  icon={ARROW_SVG}
                  className="absolute -bottom-2.5 left-1/2 inline-block h-2 w-2 -translate-x-1/2"
                  description="Arrow"
                />
              </span>
            </PopoverTrigger>

            <PopoverContent className="rounded-2xl px-2 shadow-dropdown">
              <ul className="z-20 max-h-32 space-y-0.5">
                {years?.map((u) => (
                  <li key={u}>
                    <button
                      aria-label="set year"
                      className={cn({
                        'rounded-lg py-1 px-2 hover:bg-brand-800/20': true,
                        'font-semibold text-brand-800': yearSelected === u,
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
            download: dataSource?.download_link,
            info: dataSource?.layer_info,
          }}
        />
        <SwitchWrapper id={'mangrove_national_dashboard_layer'}>
          <SwitchRoot
            id={id}
            onClick={handleClick}
            checked={isActive && Number(currentLocationId) === natDashLayer?.settings?.locationId}
          >
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      </div>
    </div>
  );
};

export default IndicatorSource;
