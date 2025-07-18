import { useMemo } from 'react';
import { useRouter } from 'next/router';

const CommercialFisheriesProductionMapLegend = () => {
  const { query } = useRouter();
  const { layers } = query as { layers: string };

  const layersParsed = useMemo(() => JSON.parse(layers), [layers]);
  const commercialFisheriesProductionFilter = useMemo(
    () =>
      layersParsed.find((layer) => layer.id === 'mangrove_commercial_fisheries_production')?.filter,
    [layersParsed]
  );

  return (
    <div className="flex flex-col space-y-2 font-sans text-sm text-black/60">
      <div className="flex items-center space-x-2">
        <div className="flex">
          <div className="flex flex-col">
            <div className="text-brand-900 h-2 w-2 border-2 border-[#8800FF]" />
            <div className="text-brand-900 h-2 w-2 border-2 border-[#8800FF]" />
          </div>
          <div className="text-brand-900 h-2 w-2 border-2 border-[#8800FF]" />
        </div>
        {commercialFisheriesProductionFilter && (
          <p>Showing density for {commercialFisheriesProductionFilter}</p>
        )}
        {!commercialFisheriesProductionFilter && <p>Combined density for all species</p>}
      </div>
    </div>
  );
};

export default CommercialFisheriesProductionMapLegend;
