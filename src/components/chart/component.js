import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';
import {
  Line,
  Bar,
  Cell,
  Area,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  CartesianAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Label
} from 'recharts';

import { stack, clearStack, addComponent } from './rechart-components';
import ChartTick from './tick';
import {
  allowedKeys,
  defaults
} from './constants';

import styles from './style.module.scss';

const rechartCharts = new Map([
  ['pie', PieChart],
  ['composed', ComposedChart]
]);

class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    config: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    handleMouseMove: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    onReady: PropTypes.func
  };

  static defaultProps = {
    className: '',
    handleMouseMove: null,
    handleMouseLeave: null,
    onReady: null
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
        if (data.some(d => d.key)) {
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
      handleMouseLeave
    } = this.props;

    const {
      margin = { top: 20, right: 0, left: 50, bottom: 0 },
      padding = { top: 0, right: 0, left: 0, bottom: 0 },
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
      cartesianGrid,
      cartesianAxis,
      tooltip,
      legend,
      unit,
      unitFormat
    } = content;

    clearStack();

    const { lines, bars, areas, pies } = yKeys;
    const maxYValue = this.findMaxValue(data, config);

    const RechartChart = rechartCharts.get(type);

    Object.entries(content).forEach(entry => {
      const [key, definition] = entry;
      if (allowedKeys.includes(key)) {
        addComponent(key, definition);
      }
    });

    return (
      <div ref={(r) => { this.chart = r; }}  className={styles.chart} style={{ height }}>
        <ResponsiveContainer>
          <RechartChart
            stackOffset={stackOffset}
            height={height}
            width={width}
            viewBox={viewBox}
            data={data}
            layout={layout}
            margin={margin}
            padding={padding}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {gradients && Object.keys(gradients).map(key => (
                <linearGradient
                  key={`lg_${key}`}
                  {...gradients[key].attributes}
                >
                  {gradients[key].stops && Object.keys(gradients[key].stops).map(sKey => (
                    <stop
                      key={`st_${sKey}`}
                      {...gradients[key].stops[sKey]}
                    />
                  ))
                  }
                </linearGradient>
              ))
              }

              {patterns && Object.keys(patterns).map(key => (
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
                        ...patterns[key].children[iKey]
                      }
                    );
                  })
                  }
                </pattern>
              ))
              }
            </defs>
            { stack }

            {cartesianGrid && (
              <CartesianGrid
                {...defaults['cartesianGrid']}
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
                tick={{ dy: 8, fontSize: '12px', fill: 'rgba(0,0,0,0.54)', textShadow: '0 2 4 0 rgba(0,0,0,0.5)' }}
                {...xAxis}
              />
            )}
            {yAxis && (
              <YAxis
                axisLine={false}
                tickSize={-50}
                mirror
                orientation="left"
                tickMargin={0}
                tickLine={false}
                tick={(
                  <ChartTick
                    dataMax={maxYValue}
                    unit={unit || ''}
                    unitFormat={unitFormat || (value => value)}
                    fill="#AAA"
                  />
                )}
                {...yAxis}
              />
            )}

            {areas && Object.keys(areas).map(key => (
              <Area key={key} dataKey={key} dot={false} {...areas[key]} />
            ))}

            {bars && Object.keys(bars).map(key => (
              <Bar key={key} dataKey={key} dot={false} {...bars[key]}>
                {!!bars[key].label && <Label {...bars[key].label} />}

                {bars[key].itemColor && data.map(item => (
                  <Cell
                    key={`c_${item.color}`}
                    fill={item.color}
                  />
                ))}
              </Bar>
            ))}

            {lines && Object.keys(lines).map(key => (
              <Line
                key={key}
                dataKey={key}
                dot={false}
                strokeWidth={2}
                {...lines[key]}
              />
            ))}

            {pies && (
              Object.keys(pies).map(key => (
                <Pie
                  key={key}
                  data={data}
                  dataKey={key}
                  {...pies[key]}
                >
                  {data.map(item => (
                    <Cell
                      key={`c_${item.color}`}
                      fill={item.color}
                      stroke={item.color}
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
                  top: 0 }}
                
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
      </div>
    );
  }
}

export default Chart;
