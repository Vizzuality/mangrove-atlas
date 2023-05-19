import orderBy from 'lodash-es/orderBy';

import cn from 'lib/classnames';

type TooltipProps = {
  payload: {
    color: string;
    name: string;
    payload: {
      label: string;
      valueFormatted: string;
      value: number;
      unit: string;
      color?: string;
      variant?: string;
    }[];
  };
  active: boolean;
};

const Tooltip: React.FC = ({ active, payload }: TooltipProps) => {
  if (!active) return null;

  const sortedPayload = orderBy(payload, (d) => Number(d.dataKey.split('--', 1)), 'desc');

  return (
    <div className="space-y-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      {sortedPayload?.map(({ color, name, payload, value }) => (
        <div key="label" className="flex">
          <p key={name} className={cn({ 'flex space-x-4': true })}>
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
          </p>
        </div>
      ))}
    </div>
  );
};

export default Tooltip;
