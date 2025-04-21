import Chart from 'components/chart';
import Legend from 'containers/legend';

const HeightChart = ({ legend, config }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-between py-10 print:max-w-[120mm] print:px-0">
      <Legend items={legend} variant="horizontal" />
      <Chart config={config} />
    </div>
  );
};

export default HeightChart;
