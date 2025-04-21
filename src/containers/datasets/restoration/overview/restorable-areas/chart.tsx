import Chart from 'components/chart';
import Legend from 'containers/legend';
import { formatNumberNearestInteger } from 'lib/format';

import CustomTooltip from './tooltip';

const RestorableAreasChart = ({ data }) => {
  const { units, year: years, restorable_area, restorable_area_perc, mangrove_area_extent } = data;
  const { restorable_area: restorableAreaUnit, mangrove_area: mangroveAreaUnit } = !!units && units;
  const year = !!years && years[0];

  const nonProtectedPercentage = 100 - restorable_area_perc;
  const chartData = [
    {
      label: 'Total restorable area',
      color: '#7996F3',
      percentage: formatNumberNearestInteger(restorable_area_perc),
      unit: restorableAreaUnit,
      value: restorable_area,
      valueFormatted: formatNumberNearestInteger(restorable_area),
      area: formatNumberNearestInteger(restorable_area),
    },
    {
      label: `Mangrove area in ${year}`,
      color: '#ECECEF',
      percentage: formatNumberNearestInteger(nonProtectedPercentage),
      unit: mangroveAreaUnit,
      value: mangrove_area_extent - restorable_area,
      valueFormatted: formatNumberNearestInteger(mangrove_area_extent),
      area: formatNumberNearestInteger(mangrove_area_extent),
    },
  ];

  const config = {
    type: 'pie',
    data: chartData,
    chartBase: {
      pies: {
        value: {
          displayOrder: 2,
        },
      },
    },
    tooltip: {
      content: (properties) => {
        const { active, payload } = properties;
        if (!active) return null;
        return <CustomTooltip {...properties} payload={payload[0].payload} />;
      },
    },
  };

  return (
    <div className="flex flex-col-reverse items-center pb-6 md:grid md:w-full md:grid-cols-2 md:pb-10">
      <Legend items={chartData} />
      <Chart className="w-screen md:w-full" config={config} />
    </div>
  );
};

export default RestorableAreasChart;
