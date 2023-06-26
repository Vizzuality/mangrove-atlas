const CustomTooltip = ({ active, payload }) => {
  if (!active) return null;
  const { unit, valueFormatted, label } = payload?.[0]?.payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <div className="flex items-center space-x-2 whitespace-nowrap">
        <p>{label}</p>
      </div>
      <p className="whitespace-nowrap font-bold">
        {valueFormatted} {unit}
      </p>
    </div>
  );
};

export default CustomTooltip;
