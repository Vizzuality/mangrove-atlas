import Chart from 'components/chart';
import Legend from 'containers/legend';

const IUCNEcoregionChart = ({ config }) => {
  return (
    <div className="flex flex-col-reverse items-center pb-6 md:grid md:grid-cols-2 md:pb-10">
      <Legend items={config?.legend} />
      <Chart config={config} />
    </div>
  );
};

export default IUCNEcoregionChart;
