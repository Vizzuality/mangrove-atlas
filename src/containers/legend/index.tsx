import cn from 'lib/classnames';

type Item = {
  showValue?: boolean;
  color: string;
  label: string;
  value: number;
  unit?: string;
  valueFormatted?: string;
};

type LegendTypes = {
  title?: string;
  items: Item[];
  variant?: 'horizontal' | 'vertical';
};

const Legend = ({ title, items, variant = 'vertical' }: LegendTypes) => {
  return (
    <div
      className={cn({
        'flex w-full justify-between py-2': variant === 'horizontal',
        'space-y-2': variant === 'vertical',
      })}
    >
      {title && (
        <h3 className="flex max-w-[120px] flex-col justify-center text-sm font-bold">{title}</h3>
      )}
      {items.map(({ showValue = true, color, label, valueFormatted, value, unit }) => (
        <div
          key={label}
          className={cn({ 'flex items-start': true, 'flex-1': variant === 'horizontal' })}
        >
          <div
            style={{ backgroundColor: color }}
            className="my-0.5 mr-2.5 h-4 w-2 rounded-md text-sm"
          />
          <div className="flex flex-col items-start text-sm">
            <p className="font-bold">{label}</p>
            <div className="flex space-x-2">
              {showValue && <p>{valueFormatted || value}</p>}
              {showValue && unit && <p>{unit}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Legend;

// <div className="space-y-2">
// {title && (
//   <h3 className="flex max-w-[120px] flex-col justify-center text-sm font-bold">{title}</h3>
// )}
// {items.map(({ showValue = true, color, label, valueFormatted, value, unit }) => (
//   <div key={label} className="flex items-start">
//     <div
//       style={{ backgroundColor: color }}
//       className="my-0.5 mr-2.5 h-4 w-2 rounded-md text-sm"
//     />
//     <div className="flex flex-col items-start text-sm">
//       <p className="font-bold">{label}</p>
//       <div className="flex space-x-2">
//         {showValue && <p>{valueFormatted || value}</p>}
//         {showValue && unit && <p>{unit}</p>}
//       </div>
//     </div>
//   </div>
// ))}
// </div>
