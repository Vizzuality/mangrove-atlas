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
  YAxisProps,
} from 'recharts';

import cn from 'lib/classnames';

import Brush from './brush';

type ChartRecord<T> = Record<string, T>;

type PieChartData = {
  label: string;
  value: number;
  customLabel?: string;
};

type BarChartData = {
  category: string;
  series: number[];
  label?: object;
  color?: string;
  itemColor?: string;
  dot?: object;
  fill?: string;
  stroke?: string;
  [key: string]: unknown;
};

type LineChartData = {
  x: number;
  y: number;
};

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

const Chart = ({
  config,
  className,
}: {
  config: {
    data: Array<{ color: string; [key: string]: unknown }>;
    margin?: { top: number; right: number; left: number; bottom: number };
    type?: 'pie' | 'bar' | 'line' | 'composed';
    height?: number;
    width?: number;
    layout?: 'horizontal' | 'vertical';
    stackOffset?: string;
    tooltip?: object;
    cartesianGrid?: object;
    cartesianAxis?: object;
    xAxis?: {
      tick?: object;
      tickLine?: boolean;
      tickCount?: number;
      tickMargin?: number;
      tickSize?: number;
      axisLine?: boolean;
      orientation?: 'top' | 'bottom';
      type?: 'number' | 'category';
      domain?: [number, number];
      scale?: 'linear' | 'band';
      allowDataOverflow?: boolean;
      hide?: boolean;
      mirror?: boolean;
      interval?: number;
      scaleToFit?: boolean;
      reversed?: boolean;
      allowDuplicatedCategory?: boolean;
      ticks?: number[];
      stroke?: string;
      strokeWidth?: number;
      fontSize?: string;
      fill?: string;
      textShadow?: string;
      fontFamily?: string;
      fontWeight?: string;
      fontStyle?: string;
      fontVariant?: string;
      fontStretch?: string;
      fontSynthesis?: string;
      textAnchor?: string;
      angle?: number;
      dy?: number;
      dx?: number;
      dataKey?: string;
    };
    yAxis?: YAxisProps;
    chartBase: {
      pies?: ChartRecord<PieChartData>;
      bars?: ChartRecord<BarChartData>;
      lines?: ChartRecord<LineChartData>;
      bar?: BarChartData;
    };
    xKey?: string;
    referenceLines?: object[];
    customBrush?: boolean;
    patterns?: Record<
      string,
      { attributes: object; children?: Record<string, { tag: string; [key: string]: unknown }> }
    >;
    gradients?: Record<string, { attributes: object; stops?: Record<string, object> }>;
    onBrushEnd?: (startIndex: number, endIndex: number) => void;
    startIndex?: number;
    endIndex?: number;
    dataKey?: string;
  };
  className?: string;
}) => {
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
    customBrush,
    patterns,
    gradients,
    onBrushEnd,
    startIndex,
    endIndex,
    dataKey,
  } = config;

  const { pies, bars, lines, bar } = chartBase;
  const ChartComponent = ChartsMap.get(type) as React.ElementType;

  return (
    <div
      className={cn({
        'relative h-full w-full': true,
        [`${className}`]: !!className,
      })}
    >
      <ResponsiveContainer
        width={width || '100%'}
        height={height || 250}
        className="relative w-full flex-1"
      >
        <ChartComponent
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
                      <stop key={`st_${sKey}`} {...gradients[key]?.stops?.[sKey]} />
                    ))}
                </linearGradient>
              ))}

            {patterns &&
              Object.keys(patterns).map((key) => (
                <pattern key={`pattern_${key}`} {...patterns[key].attributes}>
                  {patterns[key].children &&
                    Object.keys(patterns[key].children).map((iKey) => {
                      const child = patterns[key]?.children?.[iKey];
                      if (child && 'tag' in child) {
                        const { tag } = child;

                        return createElement(tag, {
                          key: iKey,
                          ...patterns[key]?.children?.[iKey],
                        });
                      }
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
              tickCount={5}
              tick={{
                dy: 8,
                fontSize: '12px',
                fill: 'rgba(0,0,0,0.54)',
                textShadow: '0 2 4 0 rgba(0,0,0,0.5)',
                ...xAxis?.tick,
              }}
              {...xAxis}
            />
          )}

          {yAxis && (
            <YAxis
              axisLine={false}
              orientation={yAxis?.orientation || 'left'}
              tickMargin={0}
              tickLine={false}
              {...yAxis}
            />
          )}
          {bar && dataKey && <Bar dataKey={dataKey} {...bar} />}
          {bars &&
            Object.keys(bars).map((key) => {
              return (
                <Bar key={key} dataKey={key} dot={false} {...bars[key]}>
                  {!!bars[key].label && <Label {...bars[key].label} />}
                  {bars[key].itemColor &&
                    data.map((item) => <Cell key={`c_${item.color}`} fill={item.color} />)}
                </Bar>
              );
            })}

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
                  // @ts-expect-error legacy types
                  {...DEFAULTVALUES[type]}
                >
                  {data.map((d, i) => (
                    <Cell key={`cell-${i}`} fill={(d as { color: string }).color} />
                  ))}
                  {pies[key].customLabel && (
                    <Label width={30} position="center" content={() => pies[key].customLabel} />
                  )}
                </Pie>
              );
            })}
          {referenceLines &&
            // @ts-expect-error legacy types
            referenceLines.map((line) => <ReferenceLine key={line.key} {...line} />)}
          {tooltip && <Tooltip {...tooltip} />}
          {/* {brush && (
            <BrushRecharts
              data={data}
              width="100%"
              height={5}
              margin={margin}
              {...brush}
              alwaysShowText={false}
            />
          )} */}
        </ChartComponent>
      </ResponsiveContainer>
      {customBrush && height && (
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
