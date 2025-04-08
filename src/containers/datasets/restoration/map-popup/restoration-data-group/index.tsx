import { format } from 'd3-format';
const numberFormat = format(',.0f');

const RestorationDataGroup = ({
  label,
  value,
  pct,
  unit,
}: {
  label: string;
  value: string | number;
  pct?: string;
  unit?: string;
}) => {
  return (
    <div className="flex flex-col pr-6 pb-6 font-sans text-sm text-black/85">
      <div className="font-sans font-light">{label}</div>
      <div className="whitespace-nowrap font-semibold">
        {typeof value === 'number' ? numberFormat(value) : value} {!!value && !!unit && unit}{' '}
        {!!pct && `(${pct}%)`}
        {!value && value !== 0 && '-'}
      </div>
    </div>
  );
};

export default RestorationDataGroup;
