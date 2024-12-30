type TooltipProps = {
  payload: {
    unit: 'ha' | 'km2';
    valueFormatted: string;
    percentage: number;
  };
};

const CustomTooltip = ({ payload }: TooltipProps) => {
  const { unit, valueFormatted, percentage } = payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <p className="pl-3 text-xs">
        <span className="mr-4 font-bold">Area</span> {valueFormatted} {unit}
      </p>
      <p className="pl-3 text-xs">
        <span className="mr-4 font-bold">Percentage</span> {percentage} %
      </p>
    </div>
  );
};

export default CustomTooltip;
