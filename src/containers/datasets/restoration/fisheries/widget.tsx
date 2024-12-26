import { cn } from 'lib/classnames';
import { formatAxis } from 'lib/format';

import Icon from 'components/ui/icon';
import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import BIVALVE_SVG from 'svgs/fisheries/bivalve.svg';
import CRAB_SVG from 'svgs/fisheries/crab.svg?sprite';
import FISH_SVG from 'svgs/fisheries/fish.svg?sprite';
import SHRIMP_SVG from 'svgs/fisheries/shrimp.svg?sprite';

import { useMangroveEcosystemServices } from './hooks';

const INDICATOR_ICONS = {
  shrimp: SHRIMP_SVG,
  fish: FISH_SVG,
  crab: CRAB_SVG,
  bivalve: BIVALVE_SVG,
};

const PotentialBenefitsToFisheries = () => {
  const { isFetched, isFetching, data } = useMangroveEcosystemServices({
    slug: 'fisheries',
  });

  if (!data?.length) return null;

  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPPER_STYLE]: true,
        relative: true,
      })}
    >
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-4">
          <h3 className="text-xs uppercase">potential benefits to fisheries</h3>
          <p className={WIDGET_SENTENCE_STYLE}>
            Mangrove restoration enhanced the production of new individuals for commercial purposes:{' '}
          </p>
          <div className="grid flex-1 grid-cols-2 flex-col items-center gap-2 pb-10">
            {data?.map(({ indicator, value }) => (
              <div key={indicator} className="flex space-x-4 ">
                <div
                  className={cn({
                    'box-content h-8 w-8 justify-center rounded-md p-1': true,
                    ' bg-blue-400 text-white opacity-100': !!value,
                    'bg-grey-400 bg-opacity-15 text-gray-400 text-opacity-80': !value,
                  })}
                >
                  <Icon
                    icon={INDICATOR_ICONS[indicator]}
                    className={cn({
                      'box-content h-6 w-6 rounded-md p-1': true,
                    })}
                  />
                </div>
                <div className="flex flex-col text-sm">
                  <span className="first-letter:uppercase">{indicator}</span>
                  <span className="text-xs font-bold md:text-sm">
                    {!!value ? formatAxis(Math.round(value)) : '-'}
                  </span>
                </div>
              </div>
            ))}{' '}
          </div>
        </div>
      )}
    </div>
  );
};

export default PotentialBenefitsToFisheries;
