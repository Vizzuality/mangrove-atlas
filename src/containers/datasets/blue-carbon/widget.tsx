import { useRouter } from 'next/router';

import { widgetYearAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import BlueCarbonChart from './chart';
import { useMangroveBlueCarbon } from './hooks';

const BlueCarbonWidget = () => {
  const currentYear = useRecoilValue(widgetYearAtom);

  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const id = params?.[1];
  const {
    data: { name, id: currentLocation, location_id },
  } = useLocation(locationType, id);

  const { agb, toc, soc, config, isLoading, isPlaceholderData, isFetched } = useMangroveBlueCarbon(
    {
      ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
      year: currentYear,
    },
    {}
  );
  const isAgbParsed = true;
  const { legend } = config;
  return (
    <div className={WIDGET_CARD_WRAPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div className="space-y-4">
          <p>
            Total organic carbon stored in <span className="font-bold"> {name}</span> mangroves is
            estimated at <span className="font-bold"> {toc}</span> Mt CO₂e with{' '}
            <span className="font-bold"> {agb}</span> {isAgbParsed ? 't CO₂e' : 'Mt CO₂e'} stored in
            above-ground biomass and <span className="font-bold"> {soc}</span> Mt CO₂e stored in the
            upper 1m of soil.
          </p>
          <BlueCarbonChart config={config} legend={legend} />
          <p className="text-sm italic">
            Note: This information is based on an outdated GMW version. Please use for reference
            only while we are in the process of updating this to the latest GMW version 3.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlueCarbonWidget;
