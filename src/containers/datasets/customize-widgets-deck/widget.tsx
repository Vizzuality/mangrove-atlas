import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { analysisAtom } from 'store/analysis';
import { habitatExtentSettings } from 'store/widgets/habitat-extent';

import { useQueryClient } from '@tanstack/react-query';
import { useRecoilState, useRecoilValue } from 'recoil';

import NoData from 'containers/widgets/no-data';

import Icon from 'components/icon';
import Loading from 'components/loading';
import { Popover, PopoverContent, PopoverTrigger } from 'components/popover';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SENTENCE_STYLE,
  WIDGET_SELECT_STYLES,
  WIDGET_SELECT_ARROW_STYLES,
} from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

const HabitatExtent = () => {
  const queryClient = useQueryClient();
  const [year, setYear] = useRecoilState(habitatExtentSettings);
  const [selectedUnitAreaExtent, setUnitAreaExtent] = useState('km²');
  const [isCanceled, setIsCanceled] = useState(false);

  const handleClick = useCallback(
    (y) => {
      setYear(y);
    },
    [setYear]
  );

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <div className="space-y-4">
        <p className={WIDGET_SENTENCE_STYLE}>
          The area of mangrove habitat in <span className="font-bold"> </span> was{' '}
          <span className="notranslate font-bold">
            <Popover>
              <PopoverTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {selectedUnitAreaExtent}
                  <Icon
                    icon={ARROW_SVG}
                    className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                    description="Arrow"
                  />
                </span>
              </PopoverTrigger>
              <PopoverContent className="rounded-2xl px-2 shadow-border">
                <ul className="z-20 max-h-32 space-y-0.5">
                  <li key={'u'}></li>
                </ul>
              </PopoverContent>
            </Popover>
          </span>{' '}
          in{' '}
          <Popover>
            <PopoverTrigger asChild>
              <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                holli
                <Icon
                  icon={ARROW_SVG}
                  className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                  description="Arrow"
                />
              </span>
            </PopoverTrigger>
            <PopoverContent className="rounded-2xl px-2 shadow-border">
              <ul className="z-20 max-h-56 space-y-0.5">
                <li key={'y'} className="last-of-type:pb-4">
                  <button
                    aria-label="select year"
                    className={cn({
                      'rounded-lg py-1 px-2 hover:bg-brand-800/20': true,
                      // 'font-semibold text-brand-800': y === year || y === defaultYear,
                    })}
                    type="button"
                    // onClick={() => handleClick(y)}
                  >
                    holi
                  </button>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </p>
      </div>
    </div>
  );
};

export default HabitatExtent;
