import Legend from 'containers/legend';

import Chart from 'components/chart';

const HabitatExtentChart = ({ legend, config }) => {
  return (
    <div className="flex items-center pb-10 md:grid md:grid-cols-2">
      <Legend items={legend} />
      <Chart className="w-2/3 md:w-full" config={config} />
    </div>
  );
};

export default HabitatExtentChart;
