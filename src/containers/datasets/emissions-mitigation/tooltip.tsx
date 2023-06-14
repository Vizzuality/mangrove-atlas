import { useMemo } from 'react';

import cn from 'lib/classnames';

type TooltipProps = {
  payload: {
    name: string;
    color: string;
    dataKey: string;
    payload?: {
      category: string;
    };
    value: number;
  }[];
  active: boolean;
  title: string;
};

const Tooltip: React.FC = ({ active, payload = [] }: TooltipProps) => {
  if (!active) return null;

  return (
    <div className="space-y-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      <p className="flex justify-center">{payload[0]?.payload?.category}</p>

      {/* recharts organic order is from bottom to top for the stacked bars and from top to bottom in tooltip, using reverse to show tooltip values from bottom to top */}
      {payload.reverse()?.map(({ color, name, dataKey, value }) => (
        <p key={dataKey} className={cn({ 'flex justify-between space-x-4': true })}>
          <span className="flex flex-1 space-x-2">
            <span
              className={cn({
                'mt-0.5 h-4 w-2 shrink-0 rounded-full': true,
              })}
              style={{ backgroundColor: color }}
            />
            {<span className="whitespace-nowrap font-bold">{name}</span>}
          </span>
          {<span>{value}</span>}
        </p>
      ))}
    </div>
  );
};

export default Tooltip;
