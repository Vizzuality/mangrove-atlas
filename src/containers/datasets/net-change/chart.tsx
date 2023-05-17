import Chart from 'components/chart';

import NetChangeLegend from './legend';
const NetChangeChart = ({ config }) => {
  return (
    <div>
      <NetChangeLegend />
      <Chart config={config} />
    </div>
  );
};

export default NetChangeChart;
