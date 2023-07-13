import {
  floodAreaPeriodAtom,
  floodPopulationPeriodAtom,
  floodStockPeriodAtom,
} from 'store/widgets/flood-protection';

import { useRecoilState } from 'recoil';

import CoastalProtection from './coastal-protection';
import { useMangrovesFloodProtection } from './hooks';
import FloodProtection from './widget';

const MangrovesFloodProtection = () => {
  const [areaPeriod, setAreaPeriod] = useRecoilState(floodAreaPeriodAtom);

  const [populationPeriod, setPopulationPeriod] = useRecoilState(floodPopulationPeriodAtom);

  const [stockPeriod, setStockPeriod] = useRecoilState(floodStockPeriodAtom);
  // check data for each indicator
  const selectedAreaPeriod = areaPeriod;
  const selectedPopulationPeriod = populationPeriod;
  const selectedStockPeriod = stockPeriod;
  const { data: dataArea } = useMangrovesFloodProtection(selectedAreaPeriod, {
    indicator: 'area',
  });
  const { data: dataStock } = useMangrovesFloodProtection(selectedStockPeriod, {
    indicator: 'stock',
  });
  const { data: dataPopulation } = useMangrovesFloodProtection(selectedPopulationPeriod, {
    indicator: 'population',
  });
  if (
    !dataArea?.indicatorValues?.length &&
    !dataStock?.indicatorValues?.length &&
    !dataPopulation?.indicatorValues?.length
  )
    return null;

  return (
    <div className="space-y-4">
      <CoastalProtection />
      <div className="relative pb-4">
        <div className="absolute top-0 -left-10 -right-10 border-2 border-b border-brand-800/30" />
      </div>
      {dataArea && (
        <FloodProtection
          indicator="area"
          selectedPeriod={selectedAreaPeriod}
          setPeriod={setAreaPeriod}
        />
      )}
      {dataStock && (
        <FloodProtection
          indicator="population"
          selectedPeriod={selectedPopulationPeriod}
          setPeriod={setPopulationPeriod}
        />
      )}
      {dataPopulation && (
        <FloodProtection
          indicator="stock"
          selectedPeriod={selectedStockPeriod}
          setPeriod={setStockPeriod}
        />
      )}
    </div>
  );
};

export default MangrovesFloodProtection;
