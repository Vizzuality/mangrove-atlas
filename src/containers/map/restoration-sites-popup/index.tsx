import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { AnimatePresence, motion } from 'framer-motion';

import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';
import { RestorationSitesPopUp } from 'types/map';

const PopupRestorationSites = ({
  info,
}: {
  className?: string;
  info: {
    popupInfo: RestorationSitesPopUp;
  };
}) => {
  const [open, setOpen] = useState(false);
  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPPER_STYLE]: true,
        'shadow-b-widget space-x-2 rounded-b-3xl border border-t border-slate-100 bg-white px-6 py-4':
          true,
      })}
    >
      <button className="flex w-full items-center justify-between" onClick={handleClick}>
        <h2 className="cursor-pointer whitespace-nowrap py-5 text-xs font-bold uppercase -tracking-tighter text-black/85">
          RESTORATION SITES
        </h2>
        <div
          className={cn({
            'z-50 font-normal text-brand-800': true,
            'mb-2 text-5xl': open,
            'text-3xl': !open,
          })}
        >
          {open ? '-' : '+'}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {info.popupInfo.cluster && (
              <p className="text-sm text-black/85">
                <span>
                  There are <strong>{info.popupInfo.point_count}</strong> restoration sites in this
                  location.{' '}
                </span>
                <span className="font-extralight">
                  Zoom in to view more details about each site
                </span>
              </p>
            )}

            <div className="flex w-full justify-between font-sans">
              {info.popupInfo.site_name && (
                <div className="flex flex-col">
                  <span className="text-left text-sm font-semibold text-brand-800">Site</span>
                  <span className="text-left text-xxs font-light uppercase leading-5 text-black/85">
                    {info.popupInfo.site_name}
                  </span>
                </div>
              )}

              {info.popupInfo.landscape_name && (
                <div className="flex flex-col">
                  <span className="text-left text-sm font-semibold text-brand-800">Landscape</span>
                  <span className="text-left text-xxs font-light uppercase leading-5 text-black/85">
                    {info.popupInfo.landscape_name}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PopupRestorationSites;
