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
          className="scrollbar-hide pointer-events-auto mx-auto h-full w-screen max-w-155 overflow-y-auto px-2 py-14 lg:absolute lg:top-0 lg:left-0 lg:mx-0 lg:w-143 lg:max-w-none lg:bg-transparent lg:px-5"
        >
          <LocationWidget />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WidgetsLayout;
