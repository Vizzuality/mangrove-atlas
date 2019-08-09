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
  Label,
  ReferenceLine,
  ReferenceArea
} from 'recharts';

import styles from './style.module.scss';

import ChartTick from './tick';

class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    config: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    handleMouseMove: PropTypes.func,
    handleMouseLeave: PropTypes.func
  };

  static defaultProps = {
    className: '',
    handleMouseMove: null,
    handleMouseLeave: null
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
      type,
      gradients,
      patterns,
      ...content
    } = config;

    const {
      xKey,
      yKeys,
      xAxis,
      yAxis,
      cartesianGrid,
      cartesianAxis,
      height,
      tooltip,
      layout,
      legend,
      unit,
      unitFormat,
      referenceLines,
      referenceAreas
    } = config;
    const { lines, bars, areas, pies } = yKeys;
    const maxYValue = this.findMaxValue(data, config);

    let RechartChart;
    switch (type) {
      case 'pie':
        RechartChart = PieChart;
        break;
      default: {
        RechartChart = ComposedChart;
      }
    }

    return (
      <div
        className={styles.chart}
        style={{ height }}
      >
        <ResponsiveContainer>
          <RechartChart
            height={height}
            data={data}
            layout={layout || 'horizontal'}
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

            {cartesianGrid && (
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#d6d6d9"
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
                tick={{ dy: 8, fontSize: '12px', fill: '#AAA' }}
                {...xAxis}
              />
            )}

            {yAxis && (
              <YAxis
                axisLine={false}
                tickSize={-50}
                mirror
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

            {referenceAreas && referenceAreas.map(ref => (
              <ReferenceArea
                key={Math.random()}
                {...ref}
              />
            ))}

            {referenceLines && referenceLines.map(ref => (
                <ReferenceLine
                  key={Math.random()}
                  {...ref}
                />
            ))}

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
                isAnimationActive={false}
                {...tooltip}
              />
            )}

            {legend && (
              <Legend
                className={styles.chart_legend}
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
