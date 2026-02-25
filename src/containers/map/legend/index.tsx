'use client';
import { useCallback, useState, useMemo } from 'react';

import { useRouter } from 'next/router';

import cn from '@/lib/classnames';

import { activeLayersAtom } from '@/store/layers';

import { AnimatePresence, motion } from 'motion/react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { useRecoilState } from 'recoil';

import { LocationTypes } from '@/containers/datasets/locations/types';
import { NATIONAL_DASHBOARD_LOCATIONS } from '@/containers/layers/constants';
import { widgets } from '@/containers/widgets/constants';

import SortableList from '@/components/map/legend/sortable/list';
import { ActiveLayers } from 'types/layers';
import type { WidgetTypes } from 'types/widget';

import LegendItem from './item';
import { trackEvent } from '@/lib/analytics/ga';
import { IconBaseProps } from 'react-icons/lib/iconBase';

const FaArrowDownIcon = FaArrowDown as unknown as (p: IconBaseProps) => JSX.Element;
const FaArrowUpIcon = FaArrowUp as unknown as (p: IconBaseProps) => JSX.Element;

const Legend = ({ embedded = false }: { embedded?: boolean }) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const {
    query: { params },
  } = useRouter();
  const id = params?.[1];

  const locationType = (params?.[0] || 'worldwide') as LocationTypes;
  function filterLayersByLocationType(widgets: WidgetTypes[], locationType: string): string[] {
    const filteredLayers: string[] = [];

    widgets.forEach((widget) => {
      if (widget.locationType?.includes(locationType)) {
        if (widget.layersIds) {
          filteredLayers.push(...widget.layersIds);
        }
        if (widget.contextualLayersIds) {
          filteredLayers.push(...widget.contextualLayersIds);
        }
        if (widget.subLayersIds) {
          filteredLayers.push(...widget.subLayersIds);
        }
      }
    });

    return filteredLayers;
  }

  const filteredLayersIds = filterLayersByLocationType(widgets, locationType);
  const filteredLayers = activeLayers?.filter(({ id }) => {
    return (
      filteredLayersIds.includes(id) ||
      (id.includes('mangrove_national_dashboard') &&
        filteredLayersIds.includes('mangrove_national_dashboard'))
    );
  }) as ActiveLayers[];

  const [isOpen, setIsOpen] = useState(true);

  const openLegend = useCallback(() => {
    if (!!activeLayers?.length) setIsOpen(true);
  }, [activeLayers]);

  const closeLegend = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleChangeOrder = useCallback(
    (order: string[]) => {
      const newLayers = order.map((id) => {
        return activeLayers?.find((l) => l.id === id || l.id.includes(id));
      }) as ActiveLayers[];
      const activeLayerPlanet = activeLayers?.filter((l) => l.id.includes('planet'));

      // Google Analytics tracking
      trackEvent(`Layers order`, {
        category: 'Layers',
        action: 'Drag and drop',
        label: `change layers order from ${activeLayers} to ${newLayers}`,
      });
      setActiveLayers([...newLayers, ...activeLayerPlanet]);
    },
    [activeLayers, setActiveLayers]
  );

  // planet layers behave as a basemap so there is no need to include them in the legend
  const activeLayerNoPlanet = useMemo(
    () => filteredLayers?.filter((l) => !l.id.includes('planet') && !l.id.includes('custom-area')),
    [filteredLayers]
  );

  const filterNationalDashboardLayers = !NATIONAL_DASHBOARD_LOCATIONS.includes(id)
    ? activeLayerNoPlanet?.filter((l) => !l.id.includes('national_dashboard'))
    : activeLayerNoPlanet;

  return (
    <div className="print:hidden">
      {!!filterNationalDashboardLayers?.length && (
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
                    {filterNationalDashboardLayers.map((l) => {
                      return <LegendItem id={l.id} key={l.id} embedded={embedded} l={l} />;
                    })}
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
