type TooltipProps = {
  payload: {
    label: string;
    value: number;
    percentageFormatted: string;
  };
};

const CustomTooltip = ({ payload }: TooltipProps) => {
  const { label, value, percentageFormatted } = payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <p className="font-bold">{label}</p>
      <p className="pl-3 text-xs">
        <span className="mr-4 font-bold">Number of provinces</span> {value}
      </p>
      <p className="pl-3 text-xs">
        <span className="mr-4 font-bold">Percentage</span> {percentageFormatted} %
      </p>
    </div>
  );
};

export default CustomTooltip;
