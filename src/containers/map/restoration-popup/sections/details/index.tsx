import cn from 'lib/classnames';

import type { RestorationPopUp } from 'store/map';

import { AnimatePresence, motion } from 'framer-motion';

import Detail from 'containers/map/restoration-popup/detail';

const Details = ({
  data,
  isOpen,
  handleClick,
}: {
  data: RestorationPopUp;
  isOpen: boolean;
  handleClick: () => void;
}) => {
  const {
    Tidal_range,
    Tidal_range1,
    Ant_SLR,
    Ant_SLR1,
    Future_SLR,
    Future_SLR1,
    Time_Loss,
    Time_Loss1,
    Flow_Group,
    Flow_Group1,
    Med_Patch,
    Med_Patch_1,
    Contig_Group,
    Contig_Group1,
  } = data;
  return (
    <div
      className={cn({
        'box-border flex w-full cursor-pointer flex-col items-start border-t border-slate-100 p-6 font-sans':
          true,
        'max-h-[72px] w-full overflow-hidden': !isOpen,
      })}
    >
      <div className="flex w-full items-center justify-between pb-6" onClick={handleClick}>
        <span className="m-0 text-sm font-semibold">
          <h3>DETAILS</h3>
        </span>
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
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="flex w-full grow flex-col items-center justify-between">
              <Detail label="Tidal range" pct={Tidal_range1} value={Tidal_range} />
              <Detail label="Antecedent SLR" pct={Ant_SLR1} value={Ant_SLR} />
              <Detail label="Future SLR" pct={Future_SLR1} value={Future_SLR} />
              <Detail label="Timing of loss" pct={Time_Loss1} value={Time_Loss} />
              <Detail label="Hydrological disturbance" pct={Flow_Group1} value={Flow_Group} />
              <Detail label="Patch size and number" pct={Med_Patch_1} value={Med_Patch} />
              <Detail
                label="Patch connectivity"
                pct={Contig_Group1}
                value={Contig_Group}
                unit="%"
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Details;
