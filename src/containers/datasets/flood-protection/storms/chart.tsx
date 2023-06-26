import Legend from 'containers/legend';

import Chart from 'components/chart';

import type { Data } from '../types';

const FloodProtectionChart = ({ data }: { data: Data }) => {
  return (
    <div className="flex w-full items-center justify-between pb-10">
      <Chart config={data} />
      <Legend items={data.data} />
    </div>
  );
};

export default FloodProtectionChart;
