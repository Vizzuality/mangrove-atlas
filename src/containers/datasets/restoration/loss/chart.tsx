import { Treemap } from 'recharts';

import Legend from 'containers/legend';

const LossChart = ({ config, legend }) => {
  return (
    <div className="flex flex-1 items-center justify-between pb-10">
      <Legend items={legend.items} title={legend?.title} subtitle={legend?.subtitle} />
      <Treemap {...config} />
    </div>
  );
};

export default LossChart;
