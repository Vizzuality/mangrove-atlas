type TooltipProps = {
  payload: {
    label: string;
    valueFormatted: number;
  };
};

const CustomTooltip = ({ payload }: TooltipProps) => {
  const { label, valueFormatted } = payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <p className="pl-3 text-xs">
        <span className="font-bold">{label}:</span> {valueFormatted} %
      </p>
    </div>
  );
};

export default CustomTooltip;
