import { PropsWithChildren } from 'react';

import { fullScreenAtom } from '@/store/map-settings';

import { useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';

import LocationWidget from '@/containers/location-widget';

const WidgetsLayout = (props: PropsWithChildren) => {
  const { children } = props;
  const isFullScreen = useAtomValue(fullScreenAtom);

  return (
    <AnimatePresence initial={false}>
      {!isFullScreen && (
        <motion.div
          key="content"
          initial="default"
          animate="full"
          exit="default"
          variants={{
            full: { opacity: 1 },
            default: { opacity: 0 },
          }}
          transition={{
            duration: 0.4,
          }}
          className="scrollbar-hide pointer-events-auto left-0 h-full w-screen py-14 md:absolute md:top-0 md:w-[572px] md:overflow-y-auto md:bg-transparent md:px-4"
        >
          <LocationWidget />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WidgetsLayout;
