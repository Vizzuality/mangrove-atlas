import Legend from 'containers/legend';

import Chart from 'components/chart';

const HeightChart = ({ legend, config }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-between py-10">
      <Legend items={legend} variant="horizontal" />
      <Chart config={config} />
    </div>
  );
};

export default HeightChart;
