import Chart from 'components/chart';

import Legend from './legend';

const SpeciesThreatenedChart = ({ data, legend, tooltip }) => {
  const config = {
    type: 'pie',

    data,
    tooltip,
    cartesianGrid: false,
    chartBase: {
      pies: {
        value: {
          innerRadius: 60,
          outerRadius: 80,
          paddingAngle: 0.5,
        },
      },
    },
  };
  return (
    <div className="flex flex-1 items-center justify-between py-10">
      {<Legend items={legend} />}
      <Chart config={config} />
    </div>
  );
};

export default SpeciesThreatenedChart;
