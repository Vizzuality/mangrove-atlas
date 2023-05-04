import Legend from 'containers/legend';

import Chart from 'components/chart';

const NetChangeChart = ({ config }) => {
  return (
    <div className="">
      {/* <Legend items={legend} /> */}
      <Chart config={config} />
    </div>
  );
};

export default NetChangeChart;
