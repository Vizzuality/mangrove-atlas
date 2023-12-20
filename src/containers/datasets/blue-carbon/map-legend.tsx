import { useMangroveBlueCarbon } from './hooks';

const BlueCarbonMapLegend = () => {
  const { data } = useMangroveBlueCarbon();

  return (
    <div className="flex w-full flex-col justify-between space-y-2 font-sans text-black/60">
      {data?.config?.legend?.items?.map(({ color, label }) => {
        return (
          <div key={label} className="flex items-start">
            <div
              style={{ backgroundColor: color }}
              className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md text-sm"
            />
            <div className="flex flex-col items-start text-sm">
              <p>
                {label} <span className="text-xs">t CO₂e/ha</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlueCarbonMapLegend;
