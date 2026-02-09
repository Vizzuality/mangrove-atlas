import React from 'react';

import cx from 'classnames';

export interface LegendTypeGradientProps {
  className?: {
    box?: string;
    bar?: string;
    labels?: string;
  };
  items: Array<{
    value: string;
    color: string;
  }>;
}

export const LegendTypeGradient: React.FC<LegendTypeGradientProps> = ({
  className = {},
  items,
}: LegendTypeGradientProps) => {
  return (
    <div className={cx(className.box)}>
      <div
        className={cx(className.bar, {
          'flex h-2 w-full': true,
        })}
        style={{
          backgroundImage: `linear-gradient(to right, ${items.map((i) => i.color).join(',')})`,
        }}
      />

      <ul className="mt-1 flex w-full justify-between">
        {items
          .filter(({ value }) => !!value)
          .map(({ value }) => (
            <li
              key={`${value}`}
              className={cx(className.labels, {
                'flex-shrink-0 text-xs': true,
              })}
            >
              {value}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LegendTypeGradient;
