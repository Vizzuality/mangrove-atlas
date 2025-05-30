import { formatNumberNearestInteger } from 'lib/format';
const CustomTooltip = ({ payload }) => {
  const { unit, value, percentage, label } = payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <div className="flex items-center space-x-2 whitespace-nowrap">
        <p>{label}</p>
      </div>
      <p className="whitespace-nowrap pl-3 text-xs">
        <span className="mr-4 font-bold">Area</span> {formatNumberNearestInteger(value)} {unit}
      </p>
      <p className="whitespace-nowrap pl-3 text-xs">
        <span className="mr-4 font-bold">Percentage</span> {percentage} %
      </p>
    </div>
  );
};

export default CustomTooltip;
