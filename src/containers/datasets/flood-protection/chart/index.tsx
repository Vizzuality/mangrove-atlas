import cn from 'lib/classnames';

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  CartesianAxis,
  XAxis,
  YAxis,
} from 'recharts';

import type { FloodProtectionPeriodId } from 'containers/datasets/flood-protection/types';

import { Data, Config } from '../types';

const Chart = ({
  data,
  config,
  onClick,
  className,
}: {
  data: Data;
  config: Config;
  onClick: (period: FloodProtectionPeriodId) => void;
  className?: string;
}) => {
  const {
    margin = {
      top: 20,
      right: 0,
      left: 0,
      bottom: 20,
    },
    height,
    width,
    layout = 'horizontal',
    tooltip = {},
    cartesianGrid,
    cartesianAxis,
    xAxis,
    yAxis,
    xKey,
    dataKey,
  } = config;

  return (
    <div
      className={cn({
        'relative h-full w-full': true,
        [className]: !!className,
      })}
    >
      <ResponsiveContainer
        width={width || '100%'}
        height={height || 250}
        className="relative w-full flex-1"
      >
        <BarChart
          height={Number(height)}
          width={Number(width)}
          data={data}
          layout={layout}
          margin={margin}
        >
          {cartesianGrid && (
            <CartesianGrid strokeDasharray={'4 4'} stroke="#d6d6d9" {...cartesianGrid} />
          )}

          {cartesianAxis && <CartesianAxis {...cartesianAxis} />}

          {xAxis && (
            <XAxis
              type="number"
              dataKey={xKey || ''}
              tickLine={false}
              tickCount={5}
              tick={{
                dy: 8,
                fontSize: '12px',
                fill: 'rgba(0,0,0,0.54)',
                ...(typeof xAxis.tick === 'object' ? xAxis.tick : {}),
              }}
              {...xAxis}
            />
          )}

          {yAxis && (
            <YAxis
              axisLine={false}
              orientation={yAxis.orientation || 'left'}
              tickMargin={0}
              tickLine={false}
              {...yAxis}
            />
          )}

          <Bar
            dataKey={dataKey}
            onClick={(e: { label: FloodProtectionPeriodId }) => onClick(e.label)}
            className="cursor-pointer"
          />

          {tooltip && <Tooltip {...tooltip} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
