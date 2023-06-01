import Legend from 'containers/legend';

import Chart from 'components/chart';

const DriversChangeChart = ({ legend, config }) => {
  return (
    <div className="mt-10 flex flex-1 items-center">
      <Legend items={legend.items} title={legend.title} />
      <Chart config={config} />
    </div>
  );
};

export default DriversChangeChart;
