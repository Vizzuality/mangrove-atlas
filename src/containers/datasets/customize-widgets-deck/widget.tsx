import { useState, useEffect } from 'react';

import { activeWidgetsAtom } from 'store/widgets';

import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';

import Category from 'containers/categories-menu';
import widgets from 'containers/widgets/constants';
import WidgetsMenu from 'containers/widgets/widgets-menu';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SENTENCE_STYLE,
  WIDGET_SELECT_STYLES,
  WIDGET_SELECT_ARROW_STYLES,
} from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

const CustomizeWidgetsDeck = () => {
  const displayedWidgets = useRecoilValue(activeWidgetsAtom);

  const [animateState, setAnimateState] = useState('start');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimateState('end');
    }, 1500);

    const returnTimeoutId = setTimeout(() => {
      if (animateState === 'end') {
        setAnimateState('return');
      }
    }, 4700);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(returnTimeoutId);
    };
  }, [animateState]);
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <div className="space-y-4">
        <p className={WIDGET_SENTENCE_STYLE}>
          You are showing{' '}
          <span className="notranslate font-bold">
            <Dialog>
              <DialogTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {displayedWidgets.length} of {widgets.length - 1}
                  <Icon
                    icon={ARROW_SVG}
                    className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                    description="Arrow"
                  />
                </span>
              </DialogTrigger>
              <DialogContent className="left-0 top-0 min-h-screen w-screen space-y-8 rounded-none">
                <div className="no-scrollbar space-y-8 overflow-y-auto">
                  <h2 className="font-black/85 text-3xl font-light leading-10">
                    Widgets deck settings
                  </h2>

                  <Category />

                  <WidgetsMenu />
                </div>
                <DialogClose />
              </DialogContent>
            </Dialog>
          </span>{' '}
          data cards. Customize the widgets deck according to your preferences and discover
          additional capabilities.
        </p>
      </div>

      {/* Widgets animation */}
      <div className="m-auto flex w-full flex-col items-center justify-center">
        <div className="h-[125px] w-[197px] rounded-2xl border-[5px] bg-white" />
        <div className="-mt-[105px] h-[125px] w-[197px] rounded-2xl border-[5px] bg-white" />
        <motion.div
          initial={{ x: 0, rotate: 0 }}
          animate={
            animateState === 'end'
              ? { x: 100, rotate: 7 }
              : animateState === 'return'
              ? { x: 0, rotate: 0 }
              : {}
          }
          transition={
            animateState === 'end'
              ? {
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  mass: 1,
                }
              : {
                  duration: 0.75,
                  ease: 'easeInOut',
                }
          }
          className="-mt-[105px] h-[125px] w-[197px] rounded-2xl border-[5px] border-brand-400 bg-white"
          role="presentation"
        />

        <div className="z-10 -mt-[105px] h-[125px] w-[197px] rounded-2xl border-[5px] bg-white" />
        <div className="z-10 -mt-[105px] h-[125px] w-[197px] rounded-2xl border-[5px] bg-white" />
        <div className="z-10 -mt-[105px] h-[125px] w-[197px] rounded-2xl border-[5px] bg-white" />
      </div>
    </div>
  );
};

export default CustomizeWidgetsDeck;
