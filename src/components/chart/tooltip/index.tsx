import cn from 'lib/classnames';
type TooltipProps = {
  payload: {
    payload: {
      settings: {
        label: string;
        valueFormatted: string;
        value: number;
        unit: string;
        color?: string;
        variant?: string;
      }[];
      label: string;
      direction?: 'vertical' | 'horizontal';
    };
  };
  active: boolean;
};

const Tooltip: React.FC = ({ active, payload }: TooltipProps) => {
  if (!active) return null;

  const { settings, direction, label } = payload?.[0]?.payload;

  return (
    <div className="space-y-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      {label && <p className="flex justify-center">{label}</p>}
      {settings?.map(({ label, valueFormatted, value, unit, color, variant }) => (
        <div key="label" className="flex flex-col">
          <p
            key={label}
            className={cn({ 'flex space-x-4': true, 'flex-col': direction === 'vertical' })}
          >
            <span className="flex items-center space-x-2">
              {color && (
                <div
                  className={cn({
                    'h-4 w-2 rounded-full': true,
                    'w-[2.5px]': variant === 'thin',
                  })}
                  style={{ backgroundColor: color }}
                />
              )}
              {<span className="font-bold">{label}</span>}
            </span>
            <span>
              {' '}
              {valueFormatted || value} {unit}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Tooltip;
