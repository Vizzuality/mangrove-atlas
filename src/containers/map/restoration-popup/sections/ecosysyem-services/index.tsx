import cn from 'lib/classnames';

import type { RestorationPopUp } from 'store/map';

import { AnimatePresence, motion } from 'framer-motion';

import RestorationDataGroup from 'containers/map/restoration-popup/restoration-data-group';

const EcosystemServices = ({
  data,
  isOpen,
  handleClick,
}: {
  data: RestorationPopUp;
  isOpen: boolean;
  handleClick: () => void;
}) => {
  const { SOC, AGB, Fish_Score_Inv, Fish_Score } = data;
  return (
    <div
      className={cn({
        'box-border flex w-full cursor-pointer flex-col items-start border-t border-slate-100 px-6 pt-6 font-sans':
          true,
        'max-h-[84px] w-full overflow-hidden': !isOpen,
      })}
    >
      <div className="mb-6 flex w-full items-center justify-between" onClick={handleClick}>
        <div className="space-y-0.5">
          <h3 className="m-0 text-sm font-semibold">ECOSYSTEM SERVICES</h3>
          <p className="text-xs font-light">for restored mangroves</p>
        </div>
        <span
          className={cn({
            'text-brand-800': true,
            'text-5xl': isOpen,
            'text-3xl': !isOpen,
          })}
        >
          {isOpen ? '-' : '+'}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{
              duration: 0.8,
              ease: [0.04, 0.62, 0.23, 0.98],
              opacity: { delay: 0.1 },
            }}
          >
            <div className="w-fit-content grid grid-flow-col grid-rows-2 gap-2">
              <RestorationDataGroup label="Mean soil organic carbon" value={SOC} unit="mtCO2e" />
              <RestorationDataGroup label="Mean aboveground carbon" value={AGB} unit="mtCO2e" />

              <RestorationDataGroup
                label="Commercial invert catch
             enhancement value"
                value={Fish_Score_Inv}
              />
              <RestorationDataGroup
                label="Commercial fish catch
             enhancement value"
                value={Fish_Score}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcosystemServices;
