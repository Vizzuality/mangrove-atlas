import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';
import {
  Line,
  Bar,
  Cell,
  Area,
  Pie,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  CartesianAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  RadialBarChart,
  Label,
} from 'recharts';

import Brush from './brush';

import { stack, clearStack, addComponent } from './rechart-components';
import ChartTick from './tick';
import {
  allowedKeys,
  defaults,
} from './constants';

import styles from './style.module.scss';

const rechartCharts = new Map([
  ['pie', PieChart],
  ['radial', RadialBarChart],
  ['composed', ComposedChart],
]);

const numberFormat = format(',.2f');

class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    config: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    handleMouseMove: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    onReady: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    handleMouseMove: null,
    handleMouseLeave: null,
    onReady: null,
  }

  componentDidMount() {
    const { onReady } = this.props;

    if (onReady) onReady(this.chart);
  }

  findMaxValue = (data, config) => {
    const { yKeys } = config;
    const maxValues = [];

    Object.keys(yKeys).forEach((key) => {
      Object.keys(yKeys[key]).forEach((subKey) => {
        if (data.some((d) => d.key)) {
          maxValues.push(maxBy(data, subKey)[subKey]);
        }
      });
    });

    return max(maxValues);
  };

  render() {
    const {
      data,
      config,
      handleMouseMove,
      handleMouseLeave,
      onBrushEnd,
    } = this.props;

    const {
      margin = {
        top: 20, right: 0, left: 50, bottom: 0,
      },
      padding = {
        top: 0, right: 0, left: 0, bottom: 0,
      },
      type = 'composed',
      height,
      width,
      viewBox,
      layout = 'horizontal',
      gradients,
      patterns,
      stackOffset,
      ...content
    } = config;
    const {
      xKey,
      yKeys,
      xAxis,
      yAxis,
      brush,
      cartesianGrid,
      cartesianAxis,
      tooltip,
      legend,
      unit,
      unitFormat,
    } = content;

    clearStack();
    const {
      lines, bars, areas, pies, tree,
    } = yKeys;
    const maxYValue = this.findMaxValue(data, config);
    const RechartChart = rechartCharts.get(type);

    Object.entries(content).forEach((entry) => {
      const [key, definition] = entry;
      if (allowedKeys.includes(key)) {
        addComponent(key, definition);
      }
    });

    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div className={styles.customTooltip}>
            <p><b>{`${payload[0].payload.label}:`}</b></p>
            <p>{`${numberFormat(payload[0].value)} ha`}</p>
          </div>
        );
      }

      return null;
    };

    return (
      <div key={this.props.name} ref={(r) => { this.chart = r; }} className={styles.chart} style={{ height }}>
        <ResponsiveContainer width="100%" height={tree ? 0 : height}>
          <RechartChart
            stackOffset={stackOffset}
            height={height}
            viewBox={viewBox}
            data={data}
            layout={layout}
            margin={margin}
            padding={padding}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {gradients && Object.keys(gradients).map((key) => (
                <linearGradient
                  key={`lg_${key}`}
                  {...gradients[key].attributes}
                >
                  {gradients[key].stops && Object.keys(gradients[key].stops).map((sKey) => (
                    <stop
                      key={`st_${sKey}`}
                      {...gradients[key].stops[sKey]}
                    />
                  ))}
                </linearGradient>
              ))}

              {patterns && Object.keys(patterns).map((key) => (
                <pattern
                  key={`pattern_${key}`}
                  {...patterns[key].attributes}
                >
                  {patterns[key].children && Object.keys(patterns[key].children).map((iKey) => {
                    const { tag } = patterns[key].children[iKey];

                    return React.createElement(
                      tag,
                      {
                        key: iKey,
                        ...patterns[key].children[iKey],
                      },
                    );
                  })}
                </pattern>
              ))}
            </defs>
            {stack}

            {cartesianGrid && (
              <CartesianGrid
                {...defaults.cartesianGrid}
                {...cartesianGrid}
              />
            )}

            {cartesianAxis && (
              <CartesianAxis
                {...cartesianAxis}
              />
            )}

            {xAxis && (
              <XAxis
                dataKey={xKey || ''}
                axisLine={false}
                tickLine={false}
                tickCount={8}
                tick={{
                  dy: 8, fontSize: '12px', fill: 'rgba(0,0,0,0.54)', textShadow: '0 2 4 0 rgba(0,0,0,0.5)',
                }}
                {...xAxis}
              />
            )}

            {yAxis && (
              <YAxis
                axisLine={false}
                // tickSize={-50}
                // mirror
                orientation={yAxis.orientation || 'left'}
                tickMargin={0}
                tickLine={false}
                tick={(
                  <ChartTick
                    dataMax={maxYValue}
                    unit={unit || ''}
                    unitFormat={unitFormat || ((value) => value)}
                    fill="#AAA"
                  />
                )}
                {...yAxis}
              />

            )}

            {areas && Object.keys(areas).map((key) => (
              <Area key={key} dataKey={key} dot={false} {...areas[key]} />
            ))}

            {bars && Object.keys(bars).map((key) => (
              <Bar key={key} dataKey={key} dot={false} {...bars[key]}>
                {!!bars[key].label && <Label {...bars[key].label} />}
                {bars[key].itemColor && data.map((item) => (
                  <Cell
                    key={`c_${item.color}`}
                    fill={item.color}
                  />
                ))}
              </Bar>
            ))}

            {lines && Object.keys(lines).map((key) => (
              <Line
                key={key}
                dataKey={key}
                dot={false}
                strokeWidth={2}
                {...lines[key]}
              />
            ))}

            {pies && (
              Object.keys(pies).map((key) => (
                <Pie
                  key={key}
                  data={data}
                  dataKey={key}
                  {...pies[key]}
                >

                  {pies[key].customLabel && (
                    <Label
                      width={30}
                      position="center"
                      content={pies[key].customLabel}
                    />
                  )}

                  {data.map((item) => (

                    <Cell
                      key={`c_${item.color}`}
                      fill={item.color}
                      stroke={item?.stroke || item.color}
                      {...item}
                    />
                  ))}
                </Pie>
              ))
            )}

            {layout === 'vertical' && xAxis && (
              <XAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                {...xAxis}
              />
            )}

            {tooltip && (
              <Tooltip
                wrapperStyle={{
                  position: 'absolute',
                  top: 0,

                }}
                isAnimationActive={false}
                {...tooltip}
              />
            )}
            {legend && (
              <Legend
                wrapperStyle={{ pointerEvents: 'none' }}
                {...legend}
                data={data}
              />
            )}
          </RechartChart>
        </ResponsiveContainer>

        {tree && (
          <Treemap
            data={data}
            {...config}
          >
            <Tooltip
              allowEscapeViewBox
              content={<CustomTooltip />}
              position={{ x: 0, y: 20 }}
            />
          </Treemap>
        )}

        {brush && (
          <Brush
            data={data}
            width="100%"
            height={height - 28}
            margin={margin}
            onBrushEnd={onBrushEnd}
            {...brush}
          />
        )}
      </div>
    );
  }
}

export default Chart;
