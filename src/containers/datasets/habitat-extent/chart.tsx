import Legend from 'containers/legend';

import Chart from 'components/chart';

const HabitatExtentChart = ({ legend, config }) => {
  return (
    <div className="grid grid-cols-2  items-center pb-10">
      <Legend items={legend} />
      <Chart config={config} />
    </div>
  );
};

export default HabitatExtentChart;
