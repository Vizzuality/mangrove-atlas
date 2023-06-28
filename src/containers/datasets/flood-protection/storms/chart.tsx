import Legend from 'containers/legend';

import Chart from 'components/chart';

import type { Data } from '../types';

const FloodProtectionChart = ({ data }: { data: Data }) => {
  return (
    <div className="grid w-full flex-1 grid-cols-3 items-center pb-10">
      <div className="col-span-2">
        <Chart config={data} />
      </div>
      <Legend items={data.data} />
    </div>
  );
};

export default FloodProtectionChart;
