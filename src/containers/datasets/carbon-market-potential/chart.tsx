import Legend from 'containers/legend';

import Chart from 'components/chart';

const CarbonMarketPotentialChart = ({ config, legend }) => {
  return (
    <div className="flex flex-1 items-center justify-between">
      <Legend items={legend.items} />
      <Chart config={config} />
    </div>
  );
};

export default CarbonMarketPotentialChart;
