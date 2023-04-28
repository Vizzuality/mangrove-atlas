import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import CustomTooltip from './tooltip';
const ChartsMap = new Map([['pie', PieChart]]);
const Chart = ({ config }) => {
  const { type } = config;
  const ComposedChart = ChartsMap.get(type);
  return (
    <ResponsiveContainer width="100%" height={250} className="flex-1">
      {type === 'pie' && (
        <ComposedChart>
          <Pie {...config}>
            {config.data.map((d, i) => (
              <Cell key={`cell-${i}`} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip info={config.data} />} />
        </ComposedChart>
      )}
    </ResponsiveContainer>
  );
};

export default Chart;
