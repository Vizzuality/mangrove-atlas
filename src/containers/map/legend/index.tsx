'use client';
import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { activeLayersAtom } from '@/store/layers';

import { AnimatePresence, motion } from 'motion/react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { IconBaseProps } from 'react-icons/lib/iconBase';
import { useRecoilState } from 'recoil';

import { useLocation } from '@/containers/datasets/locations/hooks';
import { LocationTypes } from '@/containers/datasets/locations/types';
import { NATIONAL_DASHBOARD_LOCATIONS } from '@/containers/layers/constants';
import { widgets } from '@/containers/widgets/constants';

import SortableList from '@/components/map/legend/sortable/list';
import type { Layer } from 'types/layers';
import type { WidgetTypes } from 'types/widget';

import LegendItem from './item';

const FaArrowDownIcon = FaArrowDown as unknown as (p: IconBaseProps) => JSX.Element;
const FaArrowUpIcon = FaArrowUp as unknown as (p: IconBaseProps) => JSX.Element;

const NATIONAL_DASHBOARD_PREFIX = 'mangrove_national_dashboard_layer_';

const Legend = ({ embedded = false }: { embedded?: boolean }) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);

  const {
    query: { params },
  } = useRouter();

  const locationId = params?.[1];
  const locationType = (params?.[0] || 'worldwide') as LocationTypes;

  const { data: locationData } = useLocation(locationId, locationType);
  const iso = locationData?.iso;

  const currentNationalLayerId = iso ? `${NATIONAL_DASHBOARD_PREFIX}${iso}` : null;

  const filterLayersByLocationType = useCallback(
    (widgetsConfig: WidgetTypes[], currentLocationType: string): string[] => {
      const filteredIds: string[] = [];

      widgetsConfig.forEach((widget) => {
        if (widget.locationType?.includes(currentLocationType)) {
          if (widget.layersIds) filteredIds.push(...widget.layersIds);
          if (widget.contextualLayersIds) filteredIds.push(...widget.contextualLayersIds);
          if (widget.subLayersIds) filteredIds.push(...widget.subLayersIds);
        }
      });

      return filteredIds;
    },
    []
  );

  const filteredLayersIds = useMemo(
    () => filterLayersByLocationType(widgets, locationType),
    [filterLayersByLocationType, locationType]
  );

  const filteredLayers = useMemo(() => {
    return (activeLayers ?? []).filter((layer) => {
      const isStandardLayer = filteredLayersIds.includes(layer.id);

      const isCurrentNationalLayer =
        !!currentNationalLayerId && layer.id === currentNationalLayerId;

      return isStandardLayer || isCurrentNationalLayer;
    }) as Layer[];
  }, [activeLayers, filteredLayersIds, currentNationalLayerId]);

  const [isOpen, setIsOpen] = useState(true);

  const openLegend = useCallback(() => {
    if (activeLayers?.length) setIsOpen(true);
  }, [activeLayers]);

  const closeLegend = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleChangeOrder = useCallback(
    (order: string[]) => {
      const reorderedLayers = order
        .map((layerId) => activeLayers?.find((layer) => layer.id === layerId))
        .filter(Boolean) as Layer[];

      const activePlanetLayers = activeLayers?.filter((layer) => layer.id.includes('planet')) ?? [];

      trackEvent('Layers order', {
        category: 'Layers',
        action: 'Drag and drop',
        label: `change layers order`,
      });

      setActiveLayers([...reorderedLayers, ...activePlanetLayers]);
    },
    [activeLayers, setActiveLayers]
  );

  const activeLayerNoPlanet = useMemo(
    () =>
      filteredLayers?.filter(
        (layer) => !layer.id.includes('planet') && !layer.id.includes('custom-area')
      ),
    [filteredLayers]
  );

  const legendLayers = useMemo(() => {
    const isNationalDashboardLocation = NATIONAL_DASHBOARD_LOCATIONS.includes(locationId);

    if (isNationalDashboardLocation) return activeLayerNoPlanet;

    return activeLayerNoPlanet?.filter((layer) => !layer.id.startsWith(NATIONAL_DASHBOARD_PREFIX));
  }, [activeLayerNoPlanet, locationId]);

  return (
    <div className="print:hidden">
      {!!legendLayers?.length && (
        <>
          <button
            onClick={openLegend}
            data-testid="show-legend-button"
            className={cn({
              'shadow-control flex h-11 cursor-pointer items-center justify-center space-x-2 rounded-3xl bg-white px-5 py-2':
                true,
              hidden: isOpen,
            })}
          >
            <p className="text-xs font-bold whitespace-nowrap text-black/85 uppercase opacity-85">
              Show legend
            </p>

            <FaArrowUpIcon className="mb-1" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, bottom: -200 }}
                animate={{ opacity: 1, bottom: 36 }}
                exit={{ opacity: 0, bottom: -200 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
                className="shadow-card fixed w-[360px] gap-4 rounded-3xl bg-white md:right-[75px]"
                data-testid="legend-content"
              >
                <div className="box-content flex flex-col divide-y divide-gray-200 overflow-y-auto p-4 md:max-h-[55vh] print:hidden">
                  <SortableList
                    onChangeOrder={handleChangeOrder}
                    sortable={{ handle: true, enabled: true }}
                  >
                    {legendLayers.map((layer) => (
                      <LegendItem id={layer.id} key={layer.id} embedded={embedded} l={layer} />
                    ))}
                  </SortableList>
                </div>

                <button
                  onClick={closeLegend}
                  className="absolute -top-8 right-5 -z-10 rounded-t-3xl bg-white p-2"
                >
                  <FaArrowDownIcon />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Legend;
