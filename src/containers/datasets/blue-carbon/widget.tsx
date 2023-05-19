import { useRouter } from 'next/router';

import { widgetYearAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

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

  const { agb, toc, soc, config, isLoading } = useMangroveBlueCarbon(
    {
      ...(!!location_id && location_id !== 'worldwide' && { location_id: currentLocation }),
      year: currentYear,
    },
    {}
  );
  const isAgbParsed = true;
  return (
    <div>
      {isLoading && <div>...loading</div>}
      {!isLoading && (
        <>
          <p>
            Total organic carbon stored in <span className="font-bold"> {name}</span> mangroves is
            estimated at <span className="font-bold"> {toc}</span> Mt CO₂e with{' '}
            <span className="font-bold"> {agb}</span> {isAgbParsed ? 't CO₂e' : 'Mt CO₂e'} stored in
            above-ground biomass and <span className="font-bold"> {soc}</span> Mt CO₂e stored in the
            upper 1m of soil.
          </p>

          <BlueCarbonChart config={config} />
        </>
      )}
    </div>
  );
};

export default BlueCarbonWidget;
