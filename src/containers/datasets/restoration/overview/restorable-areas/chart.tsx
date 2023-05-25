import { numberFormat } from 'lib/format';

import Legend from 'containers/legend';

import Chart from 'components/chart';

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
      percentage: numberFormat(restorable_area_perc),
      unit: restorableAreaUnit,
      value: restorable_area,
      valueFormatted: numberFormat(restorable_area),
      area: numberFormat(restorable_area),
    },
    {
      label: `Mangrove area in ${year}`,
      color: '#ECECEF',
      percentage: numberFormat(100 - nonProtectedPercentage),
      unit: mangroveAreaUnit,
      value: mangrove_area_extent - restorable_area,
      valueFormatted: numberFormat(mangrove_area_extent),
      area: numberFormat(mangrove_area_extent),
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
    <div className="flex w-full flex-1 items-center justify-between pb-10">
      <Legend items={chartData} />
      <Chart config={config} />
    </div>
  );
};

export default RestorableAreasChart;
