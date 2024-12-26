import Chart from 'containers/datasets/flood-protection/chart';
import type { FloodProtectionPeriodId } from 'containers/datasets/flood-protection/types';
import Legend from 'containers/legend';

import type { ChartData, Config } from '../types';

const FloodProtectionChart = ({
  data,
  config,
  handleBarClick,
}: {
  data: ChartData[];
  config: Config;
  handleBarClick: (period: FloodProtectionPeriodId) => void;
}) => {
  return (
    <div className="grid w-full flex-1 grid-cols-3 items-center pb-10">
      <div className="col-span-2">
        <Chart config={config} data={data} onClick={handleBarClick} />
      </div>
      <Legend items={data} />
    </div>
  );
};

export default FloodProtectionChart;
