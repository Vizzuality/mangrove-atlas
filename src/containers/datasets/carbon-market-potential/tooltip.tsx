type TooltipProps = {
  settings: {
    title: string;
    label: string;
    valueFormatted: string;
    value: number;
    unit: string;
    color?: string;
    variant?: string;
  }[];
  active: boolean;
};

const Tooltip: React.FC = ({ active, settings }: TooltipProps) => {
  if (!active) return null;

  return (
    <div className="space-y-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      {settings?.map(({ label, title, valueFormatted, value, unit, color }) => (
        <div key={label} className="flex flex-col items-center">
          {title && <p className="flex justify-center">{title}</p>}
          <p className="flex items-center space-x-4">
            <span className="flex space-x-2">
              {color && <div className="h-4 w-2 rounded-full" style={{ backgroundColor: color }} />}
              {<span className="text-xs font-bold">{label}</span>}
            </span>
            <span className="text-xs">
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
