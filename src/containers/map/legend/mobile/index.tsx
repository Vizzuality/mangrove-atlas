import { useCallback, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { useRecoilValue } from 'recoil';

import cn from 'lib/classnames';
import { activeLayersAtom } from 'store/layers';

import LegendItem from '../item';

const Legend = () => {
  const activeLayers = useRecoilValue(activeLayersAtom);

  const [isOpen, setIsOpen] = useState(true);

  const openLegend = useCallback(() => {
    if (!!activeLayers?.length) setIsOpen(true);
  }, [activeLayers]);

  const closeLegend = useCallback(() => {
    setIsOpen(false);
  }, []);

  const contentVariants = {
    open: { y: '0%', opacity: 1 },
    close: { y: '-200%', opacity: 0 },
  };

  return (
    <div className="flex w-screen justify-center print:hidden">
      {!!activeLayers?.length && (
        <>
          <button
            onClick={openLegend}
            className={cn({
              'flex h-11 w-[360px] cursor-pointer items-center justify-between rounded-4xl bg-white py-2 px-10 shadow-control':
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
              className="fixed md:right-[73px]"
            >
              <div className="w-[360px] gap-4 rounded-3xl border bg-white shadow-medium animate-in duration-300 data-[state=open]:fade-in-60 data-[state=close]:slide-in-from-bottom-0 data-[state=open]:slide-in-from-bottom-16">
                <div className="divide-black/42 box-content flex max-h-[70vh] flex-col space-y-1 divide-y overflow-y-auto pt-4 md:px-4 md:print:hidden">
                  <div className="divide-black/42 box-content flex flex-col space-y-1 divide-y overflow-y-auto px-4 pt-4 print:hidden md:max-h-[55vh]">
                    {activeLayers?.map((l) => {
                      return <LegendItem id={l.id} key={l.id} l={l} />;
                    })}
                  </div>
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
