import Chart from 'components/chart';

import NetChangeLegend from './legend';
const NetChangeChart = ({ config }) => {
  return (
    <div className="print:max-w-[120mm]">
      <NetChangeLegend />
      <Chart config={config} />
    </div>
  );
};

export default NetChangeChart;
