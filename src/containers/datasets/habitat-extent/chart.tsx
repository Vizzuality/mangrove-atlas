import Legend from 'containers/legend';

import Chart from 'components/chart';

const HabitatExtentChart = ({ legend, config }) => {
  return (
    <div className="flex flex-col-reverse items-center pb-6 md:grid md:grid-cols-2 md:pb-10">
      <Legend items={legend} />
      <Chart config={config} />
    </div>
  );
};

export default HabitatExtentChart;
