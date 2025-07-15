type TooltipProps = {
  payload: {
    category: string;
    unit: number;
    valueFormatted: number;
  };
};

const CustomTooltip = ({ payload }: TooltipProps) => {
  const { category, unit, valueFormatted } = payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <p className="pl-3 text-xs">
        <span className="font-bold">
          {category} {unit}:
        </span>{' '}
        <span className="whitespace-nowrap">{valueFormatted}</span>
      </p>
    </div>
  );
};

export default CustomTooltip;
