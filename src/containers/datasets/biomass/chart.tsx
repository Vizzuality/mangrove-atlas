import Legend from 'containers/legend';

import Chart from 'components/chart';

const BiomassChart = ({ legend, config }) => {
  return (
    <div className="grid grid-cols-2 items-center">
      <Legend items={legend.items} title={legend.title} />
      <Chart config={config} />
    </div>
  );
};

export default BiomassChart;
