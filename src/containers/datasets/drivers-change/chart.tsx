import Legend from 'containers/legend';

import Chart from 'components/chart';

const DriversChangeChart = ({ legend, config }) => {
  return (
    <div className="flex flex-1 items-center justify-between pb-10">
      <Legend items={legend.items} title={legend.title} />
      <Chart config={config} />
    </div>
  );
};

export default DriversChangeChart;
