import { useState } from 'react';

import cn from 'lib/classnames';

import NoData from 'containers/widgets/no-data';

import SuggestedLayers from 'components/suggested-layers';
import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';
import { Popover, PopoverContent, PopoverTrigger } from 'components/ui/popover';
import {
  WIDGET_CARD_WRAPPER_STYLE,
  WIDGET_SENTENCE_STYLE,
  WIDGET_SELECT_STYLES,
  WIDGET_SELECT_ARROW_STYLES,
} from 'styles/widgets';

import ARROW_SVG from 'svgs/ui/arrow-filled.svg?sprite';

import ProtectionChart from './chart';
import { useMangroveProtectedAreas } from './hooks';
const Protection = () => {
  const [selectedUnit, setUnit] = useState('ha');
  const { data, isFetched, isFetching } = useMangroveProtectedAreas({ unit: selectedUnit });

  if (isFetched && !Object.keys(data || {}).length) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isFetching && !isFetched} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-4">
          <p className={WIDGET_SENTENCE_STYLE}>
            Mangroves found in protected areas in{' '}
            <span className="font-bold">{data.location} </span> in{' '}
            <span className="font-bold">{data.currentYear} </span> represented{' '}
            <span className="font-bold">
              {data.protectedArea}{' '}
              <Popover>
                <PopoverTrigger asChild>
                  <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                    {selectedUnit}
                    <Icon
                      icon={ARROW_SVG}
                      className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`}
                    />
                  </span>
                </PopoverTrigger>
                <PopoverContent>
                  <ul className="max-h-56 space-y-2">
                    {data.units?.map((u) => (
                      <li key={u} className="last-of-type:pb-4">
                        <button
                          className={cn({
                            'font-bold': true,
                            'text-brand-800': selectedUnit === u,
                            'hover:text-brand-800': selectedUnit !== u,
                            'opacity-50': selectedUnit === u,
                          })}
                          type="button"
                          onClick={() => setUnit(u)}
                        >
                          {u}
                        </button>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            </span>{' '}
            out of a total <span className="font-bold">{data.totalArea}</span>{' '}
            <Popover>
              <PopoverTrigger asChild>
                <span className={`${WIDGET_SELECT_STYLES} print:border-hidden`}>
                  {selectedUnit}
                  <Icon icon={ARROW_SVG} className={`${WIDGET_SELECT_ARROW_STYLES} print:hidden`} />
                </span>
              </PopoverTrigger>
              .
              <PopoverContent>
                <ul className="max-h-56 space-y-2">
                  {data.units?.map((u) => (
                    <li key={u} className="last-of-type:pb-4">
                      <button
                        className={cn({
                          'font-bold': true,
                          'text-brand-800': selectedUnit === u,
                          'hover:text-brand-800': selectedUnit !== u,
                          'opacity-50': selectedUnit === u,
                        })}
                        type="button"
                        onClick={() => setUnit(u)}
                      >
                        {u}
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </p>
          <ProtectionChart config={data.config} legend={data.legend} />
          <p className="text-sm italic">
            Note: This represents the proportion of mangroves known to occur within protected areas.
            The level and the effectiveness of protection of these mangroves however are unknown.
          </p>
        </div>
      )}
      <SuggestedLayers
        thumbSource="/images/thumbs/contextual/mangrove_protected_areas.png"
        name="WDPA"
        id="mangrove_protected_areas"
        description="We recommend you to use WDPA..."
      />
    </div>
  );
};

export default Protection;
