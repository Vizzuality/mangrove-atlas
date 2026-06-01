import cn from '@/lib/classnames';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WIDGET_SELECT_ARROW_STYLES, WIDGET_SELECT_STYLES } from 'styles/widgets';

import ARROW_SVG from '@/svgs/ui/arrow-filled';

import type { IndicatorYearProps } from './types';

const IndicatorYear = ({ years, yearSelected, setYearSelected }: IndicatorYearProps) => {
  return (
    <div>
      {years?.length === 1 && <span>{years?.[0]}</span>}
      {years?.length > 1 && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-label={`Select year, current ${yearSelected}`}
              className={`${WIDGET_SELECT_STYLES}`}
            >
              {yearSelected}
              <ARROW_SVG
                className={`fill-current ${WIDGET_SELECT_ARROW_STYLES}`}
                aria-hidden="true"
              />
            </button>
          </PopoverTrigger>

          <PopoverContent className="shadow-border rounded-2xl px-2">
            <div role="listbox" aria-label="Year" className="max-h-32 space-y-0.5">
              {years?.map((u) => (
                <button
                  key={u}
                  role="option"
                  aria-selected={yearSelected === u}
                  className={cn({
                    'hover:bg-brand-800/20 block w-full rounded-lg px-2 py-1 text-left': true,
                    'hover:text-brand-800': yearSelected !== u,
                    'pointer-events-none opacity-50': yearSelected === u,
                  })}
                  type="button"
                  onClick={() => setYearSelected(u)}
                  disabled={yearSelected === u}
                >
                  {u}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default IndicatorYear;
