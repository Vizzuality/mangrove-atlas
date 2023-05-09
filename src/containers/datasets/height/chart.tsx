import Legend from 'containers/legend';

import Chart from 'components/chart';

const HeightChart = ({ config }) => {
  return (
    <div className="flex flex-1 items-center justify-between pb-10">
      {/* <Legend items={legend} /> */}
      <Chart config={config} />
    </div>
  );
};

export default HeightChart;
