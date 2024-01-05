import { numberFormat } from 'lib/format';

import Legend from 'containers/legend';

import Chart from 'components/chart';

import CustomTooltip from './tooltip';
import type { Data } from './types';

const CHART_LABELS = {
  SOC: 'Soil Organic Carbon',
  AGB: 'Aboveground Carbon',
};

const CHART_COLORS = {
  SOC: '#ECECEF',
  AGB: '#7996F3',
};

const RestorationValueChart = ({ data }: { data: Data }) => {
  const { unit, chartData } = data;
  const total = chartData.reduce((acc, { value }) => acc + value, 0);
  const parsedData = chartData?.map(({ indicator, value }) => {
    return {
      label: CHART_LABELS[indicator],
      color: CHART_COLORS[indicator],
      unit,
      value,
      valueFormatted: numberFormat(value),
      percentage: numberFormat((value * 100) / total),
    };
  });

  const config = {
    type: 'pie',
    data: parsedData,
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
      <Legend items={config.data} />
      <Chart className="w-screen md:w-full" config={config} />
    </div>
  );
};

export default RestorationValueChart;
