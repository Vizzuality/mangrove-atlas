import React from 'react';

import cx from 'classnames';

export interface LegendTypeBasicProps {
  className?: string;
  items: Array<{
    value: string;
    color: string;
  }>;
}

export const LegendTypeBasic: React.FC<LegendTypeBasicProps> = ({
  className = '',
  items,
}: LegendTypeBasicProps) => {
  return (
    <div
      className={cx({
        [className]: !!className,
      })}
    >
      <ul className="flex w-full flex-col space-y-1">
        {items.map(({ value, color }) => (
          <li key={`${value}`} className="flex space-x-2 text-xs">
            <div
              className="border-navy-500 mt-1 h-2 w-2 flex-shrink-0 border"
              style={{
                backgroundColor: color,
              }}
            />
            <div>{value}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegendTypeBasic;
