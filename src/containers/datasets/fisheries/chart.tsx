import Legend from 'containers/legend';

import Chart from 'components/chart';

const FisheriesChart = ({ config, legend }) => {
  return (
    <div className="grid grid-cols-2 items-center">
      <Legend items={legend} />
      <Chart config={config} />
    </div>
  );
};

export default FisheriesChart;
