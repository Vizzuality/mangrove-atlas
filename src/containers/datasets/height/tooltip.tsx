import { useMemo } from 'react';

import cn from 'lib/classnames';

type TooltipProps = {
  payload: {
    color: string;
    name: string;
    dataKey: string;
    value: number;
    payload: {
      label: string;
      valueFormatted: string;
      value: number;
      unit: string;
      color?: string;
      variant?: string;
    };
  }[];
  active: boolean;
};

const Tooltip: React.FC = ({ active, payload = [] }: TooltipProps) => {
  const sortedPayload = useMemo(
    () =>
      payload.sort((a, b) => {
        if (Number(a.dataKey.split('-', 1)) >= Number(b.dataKey.split('-', 1))) return -1;
        if (Number(a.dataKey.split('-', 1)) < Number(b.dataKey.split('-', 1))) return 1;
        return 0;
      }),
    [payload],
  );

  if (!active) return null;

  return (
    <div className="space-y-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      {sortedPayload?.map(({ color, name, payload, value, dataKey }) => (
        <div key={dataKey} className="flex">
          <span className={cn({ 'flex space-x-4': true })}>
            <span className="flex items-center space-x-2">
              {color && (
                <div
                  className={cn({
                    'h-4 w-2 rounded-full': true,
                  })}
                  style={{ backgroundColor: color }}
                />
              )}
              {<span className="font-bold">{name}</span>}
            </span>
            <span>
              {' '}
              {value}
              {payload?.[`percentage${name}`]} {'%'}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default Tooltip;
