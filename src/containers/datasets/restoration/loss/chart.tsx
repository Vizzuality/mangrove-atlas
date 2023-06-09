import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';

import Legend from 'containers/legend';

import CustomTooltip from './tooltip';

const LossChart = ({ config, legend }) => {
  return (
    <div className="grid grid-cols-2 items-center justify-between gap-4 pb-10 pt-4">
      <Legend items={legend.items} title={legend?.title} subtitle={legend?.subtitle} />
      <ResponsiveContainer width={'100%'} height={220}>
        <Treemap {...config}>
          <Tooltip content={(properties) => <CustomTooltip {...properties} />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default LossChart;
