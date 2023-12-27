import cn from 'lib/classnames';

const labelsForLayer = [
  {
    color: '#A6CB10',
    label: 'Gain',
    variant: 'thick',
  },
  {
    color: '#EB6240',
    label: 'Loss',
    variant: 'thick',
  },
];

const NetChangeMapLegend = () => (
  <ul className="flex flex-col space-y-2">
    {labelsForLayer?.map((d) => (
      <li key={`item-${d.label}`} className="inline-flex items-center space-x-2">
        <div
          className={cn({
            'h-4 w-2': true,
            'w-[2.5px]': d.variant === 'thin',
            'rounded-md': d.variant === 'thick',
          })}
          style={{ backgroundColor: d.color }}
        />
        <span className="text-sm text-black/85">{d.label}</span>
      </li>
    ))}
  </ul>
);

export default NetChangeMapLegend;
