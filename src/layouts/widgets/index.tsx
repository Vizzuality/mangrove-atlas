import { PropsWithChildren } from 'react';

import { fullScreenAtom } from 'store/map-settings';

import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';

import LocationWidget from 'containers/location-widget';

const WidgetsLayout = (props: PropsWithChildren) => {
  const { children } = props;
  const isFullScreen = useRecoilValue(fullScreenAtom);

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
          className="left-0 h-full w-screen py-14 scrollbar-hide print:bg-transparent print:px-0 md:absolute md:top-0 md:w-[560px] md:overflow-y-auto md:bg-transparent md:px-4"
        >
          <LocationWidget />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WidgetsLayout;
