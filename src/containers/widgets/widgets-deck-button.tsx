import { motion } from 'motion/react';

import Helper from '@/containers/help/helper';

import { DialogTrigger } from '@/components/ui/dialog';

import SETTINGS_SVG from '@/svgs/ui/settings';

const buttonMotion = {
  rest: {
    width: 48,
    x: 0,
    transition: { duration: 0.2, type: 'tween', ease: 'easeIn' },
  },
  hover: {
    width: 172,
    x: -62,
    transition: { duration: 0.2, type: 'tween', ease: 'easeOut' },
  },
};

const textMotion = {
  rest: {
    opacity: 0,
    transition: { ease: 'easeOut', duration: 0.2, type: 'tween', x: 140, width: 0 },
  },
  hover: {
    opacity: 1,
    x: 0,
    width: 140,
    transition: { duration: 0.4, type: 'tween', ease: 'easeIn' },
  },
};

const HELPER_MESSAGE =
  'Opens deck to select which widgets and map layers are displayed on the left side of the screen. Widgets provide information and statistics about a selected geography, protected area, or user-inputted polygon. Most widgets also come with a map layer that can be toggled on and off. Users can select groups of widgets organized by theme or customize their own combination of widgets and map layers. Some layers and widgets are not available for certain locations. Select applicable geography to enable layer.';

export default function WidgetsDeckButton() {
  return (
    <Helper
      className={{ button: '-top-1.5 right-0 z-20', tooltip: 'w-fit-content' }}
      tooltipPosition={{ top: -50, left: 0 }}
      message={HELPER_MESSAGE}
    >
      <DialogTrigger asChild>
        <motion.div
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="fixed bottom-3 left-1/2 z-20 -translate-x-1/2 xl:left-[calc((572px-48px)/2)] xl:translate-x-0"
        >
          <motion.button
            type="button"
            aria-label="Open widgets deck"
            className="bg-brand-800 shadow-control hover:bg-brand-800/90 focus-visible:ring-brand-400 flex h-12 min-w-[48px] cursor-pointer items-center gap-2 rounded-full py-4 pr-5 pl-4 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            variants={buttonMotion}
          >
            <SETTINGS_SVG className="h-4 w-4 shrink-0 fill-current" role="img" aria-hidden={true} />
            <motion.span variants={textMotion} className="whitespace-nowrap">
              Widgets deck
            </motion.span>
          </motion.button>
        </motion.div>
      </DialogTrigger>
    </Helper>
  );
}
