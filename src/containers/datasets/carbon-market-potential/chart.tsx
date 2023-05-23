import Chart from 'components/chart';

const CarbonMarketPotentialChart = ({ config }) => {
  return (
    <div className="flex flex-1 items-center justify-between pb-10">
      <Chart config={config} />
    </div>
  );
};

export default CarbonMarketPotentialChart;
