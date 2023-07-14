import cn from 'lib/classnames';

type Item = {
  showValue?: boolean;
  highlightValue?: boolean;
  color: string;
  label: string;
  labelFormatted?: string;
  value?: number;
  unit?: string;
  valueFormatted?: string;
};

type LegendTypes = {
  title?: string;
  subtitle?: string;
  items: Item[];
  variant?: 'horizontal' | 'vertical';
  unit?: string;
};

const Legend = ({ title, subtitle, items, variant = 'vertical' }: LegendTypes) => {
  return (
    <div
      className={cn({
        'flex w-full justify-between py-2 text-black/85': variant === 'horizontal',
        'flex flex-col space-y-2': variant === 'vertical',
      })}
    >
      {title && (
        <h3 className="block max-w-[120px] flex-col justify-center text-sm font-bold">{title}</h3>
      )}
      {subtitle && (
        <h2 className="flex max-w-[120px] flex-col justify-center text-sm font-bold opacity-30">
          {subtitle}
        </h2>
      )}
      {items?.map(
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

export default Legend;
