import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { AnimatePresence, motion } from 'framer-motion';

import { INFO } from 'containers/datasets';
import { COLORS } from 'containers/datasets/iucn-ecoregion/constants';
import type { IUCNEcoregionPopUpInfo, Label } from 'containers/datasets/iucn-ecoregion/types';

import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/dialog';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

type Tags =
  | 'Historical (1750)'
  | 'Past 50 years (1970)'
  | 'Future (¹)'
  | 'Not evaluated'
  | 'Extent of occurrence'
  | 'Area of occupancy'
  | 'Threat locations <5'
  | 'Not evaluated';

const legendItems = [
  { color: '#F3AD6A', label: 'Vulnerable' },
  {
    color: '#B4DCAA',
    label: 'Least Concern',
  },
  {
    color: '#ECECEF',
    label: 'Not Evaluated',
  },
];

const FAKE_DATA_POP_UP = [
  {
    label: 'Reduction in geographic distribution',
    tags: ['Historical (1750)', 'Past 50 years (1970)', 'Future (¹)'],
    data: 'reduction_in_geographic_distribution',
  },
  {
    label: 'Restricted geographic distribution',
    tags: ['Extent of occurrence', 'Area of occupancy', 'Threat locations <5'],
    data: 'restricted_geographic_distribution',
  },
  {
    label: 'Environmental degradation',
    tags: ['Historical (1750)', 'Past 50 years (1970)', 'Future (¹)'],
    data: 'environmental_degradation',
  },
  {
    label: 'Distribution of biotic processes',
    tags: ['Historical (1750)', 'Past 50 years (1970)', 'Future (¹)'],
    data: 'distribution_of_biotic_processes',
  },
  {
    label: 'Quantitative risk analysis',
    tags: ['Not evaluated'],
    data: 'quantitative_risk_analysis',
  },
];

const Info = INFO['mangrove_iucn_ecoregion'];

const IucnEcoregionPopup = ({ info }: { info: IUCNEcoregionPopUpInfo }) => {
  const [open, setOpen] = useState(false);
  const handleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPPER_STYLE]: true,
        'shadow-b-widget w-[500px] space-x-2 rounded-b-3xl border border-t border-slate-100 bg-white px-6 py-4':
          true,
      })}
    >
      <button className="flex w-full items-center justify-between" onClick={handleClick}>
        <h2 className="cursor-pointer whitespace-nowrap py-5 text-xs font-bold uppercase -tracking-tighter text-black/85">
          ECOSYSTEM ASSESSMENT
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
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="flex flex-col space-y-6"
          >
            <Dialog>
              <DialogTrigger>
                <p className="w-full text-right text-xs text-brand-800 underline">
                  Province Descriptions
                </p>
              </DialogTrigger>
              <DialogContent className="w-screen md:mb-20 md:w-auto">
                <div className="no-scrollbar overflow-y-auto">
                  <Info />
                </div>
                <DialogClose className="top-8 md:fixed md:!top-18 md:left-[595px]" />
              </DialogContent>
            </Dialog>
            <div className="flex flex-col space-y-1">
              <ul className="flex space-x-2 text-sm">
                {legendItems.map(({ color, label }) => (
                  <li key={label} className="flex items-center space-x-2">
                    {color && (
                      <div
                        className={cn({
                          'h-4 w-2 shrink-0 rounded-full font-normal': true,
                        })}
                        style={{ backgroundColor: color }}
                      />
                    )}
                    {<span>{label}</span>}
                  </li>
                ))}
              </ul>
              <p className="text-xs">(1) Or any 50 year period</p>
            </div>

            <div>
              <p className="text-sn font-sans font-semibold">{info?.unit_name}</p>
              <div className="max-h-[250px] overflow-y-auto pt-3 pr-2">
                {FAKE_DATA_POP_UP.map(
                  ({ label, tags, data }: { label: Label; tags: Tags[]; data: string }) => (
                    <div key="label">
                      <p className="text-sm">{label}</p>
                      <ul className="flex space-x-3 py-4">
                        {tags.map((tag, index) => {
                          const infoKey = `${data}_${index + 1}`;
                          const colorKey = info[infoKey] as string;

                          // Check if colorKey is defined and has a value
                          const backgroundColor = colorKey
                            ? COLORS[colorKey.toLowerCase() as keyof typeof COLORS]
                            : 'ne';

                          return (
                            <div
                              key={`${label}-distribution_of_biotic_processes_${index + 1}`}
                              className="flex-1 rounded-3xl py-2 text-center text-xs font-normal"
                              style={{ backgroundColor }}
                            >
                              {tag}
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IucnEcoregionPopup;
