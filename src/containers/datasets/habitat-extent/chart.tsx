import Legend from 'containers/legend';

import Chart from 'components/chart';

const HabitatExtentChart = ({ data, legend }) => {
  const config = {
    type: 'pie',
    innerRadius: 60,
    outerRadius: 80,
    paddingAngle: 2,
    dataKey: 'value',
    data,
  };
  return (
    <div className="flex flex-1 items-center justify-between">
      <Legend items={legend} />
      <Chart config={config} />
    </div>
  );
};

export default HabitatExtentChart;
