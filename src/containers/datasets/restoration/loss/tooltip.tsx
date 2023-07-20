import { numberFormat } from 'lib/format';
const CustomTooltip = (data) => {
  const { payload } = data;
  if (!payload.length) return null;
  const legendData = payload[0].payload;

  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-lg">
      <div className="flex max-w-[180px] items-start space-x-2">
        <div className="h-4 w-0.5 " style={{ backgroundColor: legendData.color }} />
        <p className="font-bold">{legendData.label}</p>
      </div>
      <p className="pl-3 text-xs">
        {numberFormat(legendData.value)} {legendData.unit}
      </p>{' '}
    </div>
  );
};

export default CustomTooltip;
