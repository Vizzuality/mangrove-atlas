const CustomTooltip = (data) => {
  const { payload } = data;
  if (!payload.length) return null;
  const legendData = payload[0].payload;
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <div className="flex items-center space-x-2 whitespace-nowrap">
        <div className="h-3 w-0.5" style={{ backgroundColor: legendData.color }} />
        <p className="font-bold">{legendData.label}</p>
      </div>
      <p className="pl-3 text-xs">Number of species: {legendData.value}</p>
    </div>
  );
};

export default CustomTooltip;
