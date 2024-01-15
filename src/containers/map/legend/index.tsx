'use client';
import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';

import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { useRecoilState } from 'recoil';

import SortableList from 'components/map/legend/sortable/list';

import LegendItem from './item';

const Legend = ({ embedded = false }: { embedded?: boolean }) => {
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);

  const [isOpen, setIsOpen] = useState(false);
  const [sortArray, setSortArray] = useState([]);

  const openLegend = useCallback(() => {
    if (!!activeLayers.length) setIsOpen(true);
  }, [activeLayers]);

  const closeLegend = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onChangeOrder = useCallback(
    (ids: string[]) => {
      setSortArray(ids);
      const sortedLayers = activeLayers.sort(
        (a, b) => sortArray.indexOf(a.id) - sortArray.indexOf(b.id)
      );
      setActiveLayers(sortedLayers);
    },
    [activeLayers, sortArray, setActiveLayers]
  );

  const contentVariants = {
    open: { y: '-100%', opacity: 1 },
    close: { y: '10%', opacity: 0 },
  };

  return (
    <div>
      {!!activeLayers.length && (
        <>
          <button
            onClick={openLegend}
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
            <motion.div
              initial={false}
              variants={contentVariants}
              animate={isOpen ? 'open' : 'close'}
              exit="close"
              transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
              className={cn({
                fixed: true,
                'md:right-[73px]': !embedded,
                'right-7': embedded,
              })}
            >
              <div className="w-[360px] gap-4 rounded-3xl border bg-white shadow-medium animate-in duration-300 data-[state=open]:fade-in-60 data-[state=close]:slide-in-from-bottom-0 data-[state=open]:slide-in-from-bottom-16">
                <div className="divide-black/42 box-content flex flex-col space-y-1 divide-y overflow-y-auto px-4 pt-4 md:max-h-[55vh] md:print:hidden">
                  <SortableList
                    onChangeOrder={onChangeOrder}
                    sortable={{ handle: true, enabled: true }}
                  >
                    {activeLayers.map((l) => {
                      return <LegendItem id={l.id} key={l.id} embedded={embedded} l={l} />;
                    })}
                  </SortableList>
                </div>
                <button
                  onClick={closeLegend}
                  className="absolute -top-[30px] right-5 z-50 rounded-t-3xl bg-white p-2"
                >
                  <FaArrowDown />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Legend;
