import Chart from 'components/chart';
import Legend from 'containers/legend';

const FisheriesChart = ({ config }) => {
  return (
    <div className="grid grid-cols-2 items-center">
      <Legend items={config.legend} />
      <Chart config={config} />
    </div>
  );
};

export default FisheriesChart;
