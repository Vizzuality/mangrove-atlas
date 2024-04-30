'use client';
import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';

import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { useRecoilState } from 'recoil';

import SortableList from 'components/map/legend/sortable/list';
import { ActiveLayers } from 'types/layers';

import LegendItem from './item';

const Legend = ({ embedded = false }: { embedded?: boolean }) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);

  const [isOpen, setIsOpen] = useState(false);

  const openLegend = useCallback(() => {
    if (!!activeLayers.length) setIsOpen(true);
  }, [activeLayers]);

  const closeLegend = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleChangeOrder = useCallback(
    (order: string[]) => {
      const newLayers = order.map((id) => {
        return activeLayers.find((l) => l.id === id);
      }) as ActiveLayers[];
      const activeLayerPlanet = activeLayers.filter((l) => l.id.includes('planet'));
      setActiveLayers([...newLayers, ...activeLayerPlanet]);
    },
    [activeLayers, setActiveLayers]
  );

  // planet layers behave as a basemap so there is no need to include them in the legend
  const activeLayerNoPlanet = activeLayers.filter((l) => !l.id.includes('planet'));

  return (
    <div className="print:hidden">
      {!!activeLayerNoPlanet.length && (
        <>
          <button
            onClick={openLegend}
            data-testid="show-legend-button"
            className={cn({
              'flex h-11 cursor-pointer items-center justify-center space-x-2 rounded-4xl bg-white py-2 px-5 shadow-control':
                true,
              hidden: isOpen,
            })}
          >
            <p className="opacity-85 whitespace-nowrap text-xs font-bold uppercase text-black/85">
              Show legend
            </p>

            <FaArrowUp className="mb-1" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, bottom: -200 }}
                animate={{ opacity: 1, bottom: 36 }}
                exit={{ opacity: 0, bottom: -200 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
                className="fixed w-[360px] gap-4 rounded-3xl bg-white shadow-medium md:right-[75px]"
                data-testid="legend-content"
              >
                <div className="divide-black/42 box-content flex flex-col space-y-1 divide-y overflow-y-auto px-4 pt-4 print:hidden md:max-h-[55vh]">
                  <SortableList
                    onChangeOrder={handleChangeOrder}
                    sortable={{ handle: true, enabled: true }}
                  >
                    {activeLayerNoPlanet.map((l) => {
                      return <LegendItem id={l.id} key={l.id} embedded={embedded} l={l} />;
                    })}
                  </SortableList>
                </div>

                <button
                  onClick={closeLegend}
                  className="absolute -top-8 right-5 -z-10 rounded-t-3xl bg-white p-2"
                >
                  <FaArrowDown />
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
