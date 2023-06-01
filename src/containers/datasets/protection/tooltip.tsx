type TooltipProps = {
  payload: {
    unit: 'ha' | 'km2';
    value: number;
    percentage: number;
  };
};

const CustomTooltip = ({ payload }: TooltipProps) => {
  const { unit, value, percentage } = payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <p className="pl-3 text-xs">
        <span className="mr-4 font-bold">Area</span> {value} {unit}
      </p>
      <p className="pl-3 text-xs">
        <span className="mr-4 font-bold">Percentage</span> {percentage} %
      </p>
    </div>
  );
};

export default CustomTooltip;
