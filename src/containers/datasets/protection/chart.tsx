import Legend from 'containers/legend';

import Chart from 'components/chart';

const ProtectionChart = ({ config, legend }) => {
  return (
    <div className="flex items-center">
      <Legend items={legend} />
      <Chart config={config} />
    </div>
  );
};

export default ProtectionChart;
