import Chart from 'components/chart';
import Legend from 'containers/legend';

const DriversChangeChart = ({ legend, config }) => {
  return (
    <div className="mt-10 flex flex-1 items-center">
      <Legend items={legend.items} title={legend.title} />
      <Chart config={config} />
    </div>
  );
};

export default DriversChangeChart;
