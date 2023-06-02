import { createElement } from 'react';

import {
  PieChart,
  BarChart,
  LineChart,
  ComposedChart,
  Pie,
  Bar,
  Line,
  Label,
  Cell,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  CartesianAxis,
  XAxis,
  YAxis,
  ReferenceLine,
  Brush as BrushRecharts,
  // LineProps,
  // BarProps,
  // TreemapProps,
  // Tree,
  // PieProps,
} from 'recharts';

import Brush from './brush';

const DEFAULTVALUES = {
  pie: {
    innerRadius: 80,
    outerRadius: 100,
    paddingAngle: 0.5,
  },
};

const ChartsMap = new Map([
  ['pie', PieChart],
  ['bar', BarChart],
  ['line', LineChart],
  ['composed', ComposedChart],
]);

const Chart = ({ config }) => {
  const {
    data,
    margin = {
      top: 20,
      right: 0,
      left: 0,
      bottom: 20,
    },
    type = 'composed',
    height,
    width,
    layout = 'horizontal',
    stackOffset,
    tooltip,
    cartesianGrid,
    cartesianAxis,
    xAxis,
    yAxis,
    chartBase,
    xKey,
    referenceLines,
    brush,
    customBrush,
    patterns,
    gradients,
    onBrushEnd,
    startIndex,
    endIndex,
  } = config;

  const { pies, bars, lines } = chartBase;
  const Chart = ChartsMap.get(type);
  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height={height || 250} className="relative w-full flex-1">
        <Chart
          stackOffset={stackOffset}
          height={height}
          width={width}
          // viewBox={viewBox}
          data={data}
          layout={layout}
          margin={margin}
          // onMouseMove={handleMouseMove}
          // onMouseLeave={handleMouseLeave}
        >
          <defs>
            {gradients &&
              Object.keys(gradients).map((key) => (
                <linearGradient key={`lg_${key}`} {...gradients[key].attributes}>
                  {gradients[key].stops &&
                    Object.keys(gradients[key].stops).map((sKey) => (
                      <stop key={`st_${sKey}`} {...gradients[key].stops[sKey]} />
                    ))}
                </linearGradient>
              ))}

            {patterns &&
              Object.keys(patterns).map((key) => (
                <pattern key={`pattern_${key}`} {...patterns[key].attributes}>
                  {patterns[key].children &&
                    Object.keys(patterns[key].children).map((iKey) => {
                      const { tag } = patterns[key].children[iKey];

                      return createElement(tag, {
                        key: iKey,
                        ...patterns[key].children[iKey],
                      });
                    })}
                </pattern>
              ))}
          </defs>
          {cartesianGrid && (
            <CartesianGrid strokeDasharray={'4 4'} stroke="#d6d6d9" {...cartesianGrid} />
          )}

          {cartesianAxis && <CartesianAxis {...cartesianAxis} />}

          {xAxis && (
            <XAxis
              type="number"
              dataKey={xKey || ''}
              tickLine={false}
              tickCount={xAxis.tickCount || 5}
              tick={{
                dy: 8,
                fontSize: '12px',
                fill: 'rgba(0,0,0,0.54)',
                textShadow: '0 2 4 0 rgba(0,0,0,0.5)',
                ...xAxis.tick,
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
          {bars &&
            Object.keys(bars).map((key) => (
              <Bar key={key} dataKey={key} dot={false} {...bars[key]}>
                {!!bars[key].label && <Label {...bars[key].label} />}
                {bars[key].itemColor &&
                  data.map((item) => <Cell key={`c_${item.color}`} fill={item.color} />)}
              </Bar>
            ))}

          {lines &&
            Object.keys(lines).map((key) => (
              <Line key={key} dataKey={key} dot={false} strokeWidth={2} {...lines[key]} />
            ))}

          {pies &&
            Object.keys(pies).map((key) => {
              return (
                <Pie
                  key={key}
                  data={data}
                  dataKey={key}
                  startAngle={90}
                  endAngle={-270}
                  {...pies[key]}
                  {...DEFAULTVALUES[type]}
                >
                  {data.map((d, i) => (
                    <Cell key={`cell-${i}`} fill={d.color} />
                  ))}
                  {pies[key].customLabel && (
                    <Label width={30} position="center" content={pies[key].customLabel} />
                  )}
                </Pie>
              );
            })}
          {referenceLines && referenceLines.map((line) => <ReferenceLine key={line} {...line} />)}
          {tooltip && <Tooltip {...tooltip} />}
          {brush && (
            <BrushRecharts
              data={data}
              width="100%"
              height={5}
              margin={margin}
              {...brush}
              alwaysShowText={false}
            />
          )}
        </Chart>
      </ResponsiveContainer>
      {customBrush && (
        <Brush
          data={data}
          width="100%"
          height={height - 28}
          margin={margin}
          onBrushEnd={onBrushEnd}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      )}
    </div>
  );
};

export default Chart;
