import { currentLocationAtom } from 'store/location';
import { widgetYearAtom } from 'store/widget';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import BlueCarbonChart from './chart';
import { useMangroveBlueCarbon } from './hooks';

const BlueCarbonWidget = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const currentYear = useRecoilValue(widgetYearAtom);
  const { data } = useLocation(currentLocationId);
  const { name, location_id } = data;

  const {
    agb,
    toc,
    soc,
    config,
    isLoading,
    tooltip = [],
    legend = [],
  } = useMangroveBlueCarbon(
    {
      ...(!!location_id && { location_id }),
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

          <BlueCarbonChart legend={legend} tooltip={tooltip} config={config} />
        </>
      )}
    </div>
  );
};

export default BlueCarbonWidget;
