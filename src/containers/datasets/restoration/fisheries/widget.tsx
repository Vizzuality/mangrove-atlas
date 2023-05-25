import cn from 'lib/classnames';
import { numberFormat } from 'lib/format';

import Icon from 'components/icon';
import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import BIVALVE_SVG from 'svgs/fisheries/bivalve.svg?sprite';
import CRAB_SVG from 'svgs/fisheries/crab.svg?sprite';
import FISH_SVG from 'svgs/fisheries/fish.svg?sprite';
import SHRIMP_SVG from 'svgs/fisheries/shrimp.svg?sprite';

import { useMangroveEcosystemServices } from './hooks';

const PotentialBenefitsToFisheries = () => {
  const { isFetched, isFetching, data } = useMangroveEcosystemServices({
    slug: 'fisheries',
  });

  const INDICATOR_ICONS = {
    shrimp: SHRIMP_SVG,
    fish: FISH_SVG,
    crab: CRAB_SVG,
    bivalve: BIVALVE_SVG,
  };
  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPER_STYLE]: true,
        relative: true,
      })}
    >
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-4">
          <h3 className="text-xs uppercase">potential benefits to fisheries</h3>
          <p>
            Mangrove restoration enhanced the production of new individuals for commercial purposes:{' '}
          </p>
          <div className="grid flex-1 grid-cols-2 flex-col items-center space-y-2 pb-10">
            {data?.map(({ indicator, value }) => (
              <div key={indicator} className="flex space-x-4">
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
                  <span className="font-bold">{!!value ? numberFormat(value) : '-'}</span>
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
