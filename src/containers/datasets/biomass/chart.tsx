import Legend from 'containers/legend';

import Chart from 'components/chart';

const BiomassChart = ({ legend, config }) => {
  return (
    <div className="flex flex-1 items-center justify-between">
      <Legend items={legend} />
      <Chart config={config} />
    </div>
  );
};

export default BiomassChart;
