import Legend from 'containers/legend';

import Chart from 'components/chart';

const BlueCarbonChart = ({ config, legend }) => {
  return (
    <div className="flex flex-col-reverse items-center pb-6 md:grid md:grid-cols-2 md:pb-10">
      <Legend items={legend.items} title={legend.title} />
      <Chart config={config} />
    </div>
  );
};

export default BlueCarbonChart;
