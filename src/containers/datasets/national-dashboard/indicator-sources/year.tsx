import cn from 'lib/classnames';

import Icon from 'components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import { WIDGET_SELECT_ARROW_STYLES, WIDGET_SELECT_STYLES } from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import type { IndicatorYearTypes } from './types';

const IndicatorYear = ({ years, yearSelected, setYearSelected }: IndicatorYearTypes) => {
  return (
    <div className="flex max-w-fit flex-col space-y-2">
      <h5 className="text-sm font-normal">Year</h5>
      <div>
        {years.length === 1 && <span>{years[0]}</span>}
        {years.length > 1 && (
          <Popover>
            <PopoverTrigger asChild>
              <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                {yearSelected}
                <Icon
                  icon={ARROW_SVG}
                  className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                  description="Arrow"
                />
              </span>
            </PopoverTrigger>

            <PopoverContent className="rounded-2xl px-2 shadow-border">
              <ul className="max-h-32 space-y-0.5">
                {years?.map((u) => (
                  <li key={u}>
                    <button
                      key={u}
                      aria-label="set year"
                      className={cn({
                        'w-full rounded-lg py-1 px-2 text-left hover:bg-brand-800/20': true,
                        'hover:text-brand-800': yearSelected !== u,
                        'pointer-events-none opacity-50': yearSelected === u,
                      })}
                      type="button"
                      onClick={() => setYearSelected(u)}
                      disabled={yearSelected === u}
                    >
                      {u}
                    </button>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default IndicatorYear;
