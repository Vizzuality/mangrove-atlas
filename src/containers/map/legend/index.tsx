'use client';
import { useCallback, useState } from 'react';

import cn from '@/lib/classnames';

import { AnimatePresence, motion } from 'motion/react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { IconBaseProps } from 'react-icons/lib';

import SortableList from '@/components/map/legend/sortable/list';

import LegendItem from './item';
import { useLegendLayers } from './use-legend-layers';

const FaArrowDownIcon = FaArrowDown as unknown as (p: IconBaseProps) => JSX.Element;
const FaArrowUpIcon = FaArrowUp as unknown as (p: IconBaseProps) => JSX.Element;

const Legend = ({ embedded = false }: { embedded?: boolean }) => {
  const { legendLayers, handleChangeOrder } = useLegendLayers();

  const [isOpen, setIsOpen] = useState(true);

  const openLegend = useCallback(() => {
    if (legendLayers?.length) setIsOpen(true);
  }, [legendLayers]);

  const closeLegend = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div>
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
                className="shadow-card fixed w-90 gap-4 rounded-3xl bg-white md:right-18.75"
                data-testid="legend-content"
              >
                <div
                  className={cn({
                    'box-content flex flex-col overflow-y-auto p-4 md:max-h-[55vh]': true,
                  })}
                >
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
