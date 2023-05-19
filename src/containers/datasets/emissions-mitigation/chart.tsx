import Legend from 'containers/legend';

import Chart from 'components/chart';

const EmissionsMitigationChart = ({ legend, config }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-between py-10">
      <Chart config={config} />
      <Legend items={legend} variant="horizontal" />
    </div>
  );
};

export default EmissionsMitigationChart;
