type TooltipProps = {
  payload: {
    min: number;
    max: number;
  };
};

const CustomTooltip = ({ payload }: TooltipProps) => {
  const { min = 218, max = 360365 } = payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <p className="pl-3 text-xs">{`min: ${min} - max: ${max}`}</p>
    </div>
  );
};

export default CustomTooltip;
