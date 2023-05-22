import cn from 'lib/classnames';
import { numberFormat } from 'lib/format';
type TooltipProps = {
  payload: {
    name: string;
    net_change: number;
  };
  color: string;
  active: boolean;
};

const Tooltip: React.FC = ({ active, payload }: TooltipProps) => {
  if (!active) return null;
  const label = 'Net Change';
  const { color, payload: info } = payload?.[0];
  const { name, net_change } = info;
  return (
    <div className="space-y-2 rounded-2xl bg-white py-2 px-6 font-sans text-sm shadow-lg">
      {name && <p className="flex justify-center">{name}</p>}
      <div key="label" className="flex flex-col">
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
            {<span className="font-bold">{label}</span>}
          </span>
          <span> {numberFormat(net_change)} km²</span>
        </p>
      </div>
    </div>
  );
};

export default Tooltip;
