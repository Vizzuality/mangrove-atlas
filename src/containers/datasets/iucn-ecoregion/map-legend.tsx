import { cn } from 'lib/classnames';

import { useMangroveEcoregions } from './hooks';

const IUCNEcoregionsMapLegend = () => {
  const { data } = useMangroveEcoregions();

  return (
    <div className="flex w-full flex-col justify-between space-y-2 font-sans text-black/60">
      {data?.config?.legend?.map(
        ({
          showValue = true,
          color,
          label,
          labelFormatted,
          valueFormatted,
          value,
          unit,
          highlightValue = true,
        }) => {
          return (
            <div key={label} className={cn({ 'flex items-start': true })}>
              <div
                style={{ backgroundColor: color }}
                className="my-0.5 mr-2.5 h-4 w-2 shrink-0 rounded-md text-sm"
              />
              <div className="flex flex-col items-start text-sm">
                <p className={cn({ 'font-bold': highlightValue })}>{labelFormatted || label}</p>
                <div className="flex space-x-2 whitespace-nowrap">
                  {showValue && unit && (unit === '$' || unit === 'usd') && (
                    <p className="font-bold">{unit}</p>
                  )}
                  {showValue && <p className="font-bold">{valueFormatted || value}</p>}
                  {showValue && unit && unit !== '$' && unit !== 'usd' && (
                    <p className="font-bold">{unit}</p>
                  )}
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default IUCNEcoregionsMapLegend;
