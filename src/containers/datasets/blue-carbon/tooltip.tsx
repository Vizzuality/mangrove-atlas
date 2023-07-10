import { FC } from 'react';

import cn from 'lib/classnames';
type TooltipProps = {
  payload: {
    title: string;
    label: string;
    color: string;
    percentage: number;
    tooltipLabelPercentage: string;
  };
  active: boolean;
};

const Tooltip: FC = ({ active, payload: data }: TooltipProps) => {
  if (!active) return null;
  const { label, title, color, percentage, tooltipLabelPercentage } = data;
  return (
    <div className="space-y-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      <div key={label} className="flex flex-col space-y-2">
        {title && <p className="flex justify-center">{title}</p>}
        <p className={cn({ 'flex justify-center': true })}>
          <span className="flex items-center space-x-2">
            {color && (
              <div
                className={cn({
                  'h-4 w-2 rounded-full': true,
                })}
                style={{ backgroundColor: color }}
              />
            )}
            {<span className="font-bold">{label}</span>}
          </span>
        </p>
        <p className="flex space-x-4 text-xs">
          <span className="font-bold">{tooltipLabelPercentage}</span>
          <span> {percentage}%</span>
        </p>
      </div>
    </div>
  );
};

export default Tooltip;
