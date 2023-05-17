import {
  PieChart,
  BarChart,
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
} from 'recharts';

const DEFAULTVALUES = {
  pie: {
    innerRadius: 60,
    outerRadius: 80,
    paddingAngle: 0.5,
  },
};

const ChartsMap = new Map([
  ['pie', PieChart],
  ['bar', BarChart],
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
    padding = {
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    },
    type = 'composed',
    height,

    layout = 'horizontal',

    stackOffset,
    tooltip,
    cartesianGrid,
    cartesianAxis,
    xAxis,
    yAxis,
    chartBase,
    xKey,
  } = config;
  const { pies, bars, lines } = chartBase;
  const Chart = ChartsMap.get(type);

  return (
    <ResponsiveContainer width="100%" height={250} className="flex-1">
      <Chart
        stackOffset={stackOffset}
        height={height}
        // viewBox={viewBox}
        data={data}
        layout={layout}
        margin={margin}
        // onMouseMove={handleMouseMove}
        // onMouseLeave={handleMouseLeave}
      >
        {cartesianGrid && (
          <CartesianGrid strokeDasharray={'4 4'} stroke="#d6d6d9" {...cartesianGrid} />
        )}

        {cartesianAxis && <CartesianAxis {...cartesianAxis} />}

        {xAxis && (
          <XAxis
            type="number"
            dataKey={xKey || ''}
            axisLine={true}
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
            label={'ha'}
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
          Object.keys(pies).map((key) => (
            <Pie key={key} data={data} dataKey={key} {...pies[key]} {...DEFAULTVALUES[type]}>
              {data.map((d, i) => (
                <Cell key={`cell-${i}`} fill={d.color} />
              ))}
            </Pie>
          ))}
        <Tooltip {...tooltip} />
      </Chart>
    </ResponsiveContainer>
  );
};

export default Chart;
