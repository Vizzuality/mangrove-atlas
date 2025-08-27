import { useMemo } from 'react';
import { useRouter } from 'next/router';

const LEGEND_RANGES = {
  total: [
    { range: '0-1.5', color: '#f8e855' },
    { range: '1.5-2.1', color: '#78c66e' },
    { range: '2.1-2.2', color: '#468e95' },
    { range: '2.2-3.3', color: '#405187' },
    { range: '3.3-17.8', color: '#3e0751' },
  ],
  fish: [
    { range: '0-40', color: '#f0f2fb' },
    { range: '40-80', color: '#c2d6db' },
    { range: '80-105', color: '#7bacd1' },
    { range: '105-115', color: '#4b7baf' },
    { range: '>115', color: '#234f97' },
  ],
  shrimp: [
    { range: '0-170', color: '#fcede4' },
    { range: '170-220', color: '#f0b7bc' },
    { range: '220-240', color: '#e970a2' },
    { range: '240-260', color: '#b73088' },
    { range: '>260', color: '#6e1375' },
  ],
  crab: [
    { range: '0-0.5', color: '#effaec' },
    { range: '0.5-0.6', color: '#c2e2b8' },
    { range: '0.6-1', color: '#84c27c' },
    { range: '1-100', color: '#529b58' },
    { range: '>100', color: '#2e6b34' },
  ],
  bivalve: [
    { range: '0-50', color: '#fdefe2' },
    { range: '50-70', color: '#f4c28c' },
    { range: '70-90', color: '#ed904e' },
    { range: '90-110', color: '#d45e2b' },
    { range: '>110', color: '#9a3f1b' },
  ],
};

const CommercialFisheriesProductionMapLegend = () => {
  const { query } = useRouter();
  const { layers } = query as { layers: string };

  const layersParsed = useMemo(() => layers && JSON.parse(layers), [layers]);
  const commercialFisheriesProductionFilter = useMemo(
    () =>
      layersParsed?.find((layer) => layer.id === 'mangrove_commercial_fisheries_production')
        ?.filter,
    [layersParsed]
  );

  return (
    <div className="flex flex-col space-y-2 font-sans text-sm text-black/60">
      {commercialFisheriesProductionFilter && (
        <p>Showing density for {commercialFisheriesProductionFilter}</p>
      )}
      {LEGEND_RANGES[commercialFisheriesProductionFilter] &&
        LEGEND_RANGES[commercialFisheriesProductionFilter].map(({ color, range }, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="h-2 w-2" style={{ backgroundColor: color }} />
            <span>{range}</span>
          </div>
        ))}

      {!commercialFisheriesProductionFilter &&
        LEGEND_RANGES['total'].map(({ color, range }, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="h-2 w-2" style={{ backgroundColor: color }} />
            <span>{range}</span>
          </div>
        ))}
    </div>
  );
};

export default CommercialFisheriesProductionMapLegend;
