import Legend from 'containers/legend';

import Chart from 'components/chart';

const AlertsChart = ({ config }) => {
  return (
    <div className="flex flex-1 items-center justify-between pb-10">
      <Chart config={config} />
    </div>
  );
};

export default AlertsChart;
