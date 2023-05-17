import cn from 'lib/classnames';
type TooltipProps = {
  payload: {
    payload: {
      settings: { label: string; value: number; unit: string; color?: string }[];
      label: string;
      direction?: 'vertical' | 'horizontal';
    };
  };
};

const Tooltip: React.FC = ({ payload }: TooltipProps) => {
  if (!payload) return null;
  const { settings, label, direction } = payload?.payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      {label && <p className="flex justify-center">{label}</p>}
      {settings.map(({ label, value, unit, color }) => (
        <div key="label" className="flex flex-col">
          <p
            key={label}
            className={cn({ 'flex space-x-4': true, 'flex-col': direction === 'vertical' })}
          >
            <span className="flex items-center space-x-2">
              {color && <div className="h-4 w-2 rounded-full" style={{ backgroundColor: color }} />}
              <span className="font-bold">{label}</span>
            </span>
            <span>
              {' '}
              {value} {unit}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Tooltip;
