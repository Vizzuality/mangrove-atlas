import { cn } from 'lib/classnames';

import { AnimatePresence, motion } from 'framer-motion';

import RestorationDataGroup from 'containers/map/restoration-popup/restoration-data-group';

import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
import type { RestorationPopUp } from 'types/map';

const RestorationScores = ({
  data,
  isOpen,
  handleClick,
}: {
  data: RestorationPopUp;
  isOpen: boolean;
  handleClick: () => void;
}) => {
  const { Class, Max_Area_20_ha, Area_loss_ha, Rest_Area_Loss, Loss_Driver, Rest_Score } = data;

  const nonRestScore = 100 - Rest_Score;

  return (
    <div
      className={cn({
        'box-border flex w-[500px] cursor-pointer flex-col items-start border-t border-slate-100 p-6 font-sans':
          true,
        'max-h-[72px] overflow-hidden': !isOpen,
      })}
    >
      <div className="flex w-full items-center justify-between pb-6" onClick={handleClick}>
        <span>
          <h3 className={WIDGET_SUBTITLE_STYLE}>RESTORATION SCORES</h3>
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
            <div className="w-full">
              <div className="flex grow items-center justify-between">
                <RestorationDataGroup label="Mangrove type" value={Class} />
                <RestorationDataGroup
                  label="Max mangrove area 1996 - 2020"
                  value={Max_Area_20_ha}
                  unit="ha"
                />
              </div>
              <div className="flex grow items-start justify-between">
                <RestorationDataGroup label="Area of Loss" value={Area_loss_ha} unit="ha" />
                <RestorationDataGroup label="Restorable Area" value={Rest_Area_Loss} unit="ha" />
                <RestorationDataGroup label="Primary Loss Driver" value={Loss_Driver} />
              </div>
            </div>

            <div className="w-full">
              <h4 className="py-4 font-sans text-sm font-light">Restoration potential score</h4>
              <div className="flex grow items-center justify-between space-x-6">
                <div className="h-6 w-full bg-slate-100">
                  <div
                    className="relative h-full w-full"
                    style={{
                      background:
                        'linear-gradient(90deg, #F9DDDA 0%, #FFADAD 25.52%, #CE78B3 50.52%, #8478CE 78.13%, #224294 100%)',
                    }}
                  >
                    <span
                      className="absolute right-0 h-full bg-slate-100"
                      style={{
                        width: `${nonRestScore}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-4xl">{Rest_Score}</div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestorationScores;
