import {
  PieChart,
  Pie,
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

const ChartsMap = new Map([['pie', PieChart]]);
const Chart = ({ config }) => {
  const { type, data, tooltip, cartesianGrid, cartesianAxis, xAxis, yAxis, yKeys } = config;
  const { pies } = yKeys;
  const ComposedChart = ChartsMap.get(type);

  return (
    <ResponsiveContainer width="100%" height={250} className="flex-1">
      <ComposedChart>
        {cartesianGrid && (
          <CartesianGrid strokeDasharray={'4 4'} stroke="#d6d6d9" {...cartesianGrid} />
        )}

        {cartesianAxis && <CartesianAxis {...cartesianAxis} />}
        {/* 
          {xAxis && (
            <XAxis
              dataKey={xKey || ''}
              axisLine={false}
              tickLine={false}
              tickCount={8}
              tick={{
                dy: 8,
                fontSize: '12px',
                fill: 'rgba(0,0,0,0.54)',
                textShadow: '0 2 4 0 rgba(0,0,0,0.5)',
              }}
              {...xAxis}
            />
          )} */}

        {yAxis && (
          <YAxis
            axisLine={false}
            // tickSize={-50}
            // mirror
            orientation={yAxis.orientation || 'left'}
            tickMargin={0}
            tickLine={false}
            // tick={
            //   // <ChartTick
            //   //   dataMax={maxYValue}
            //   //   unit={unit || ''}
            //   //   unitFormat={unitFormat || ((value) => value)}
            //   //   fill="#AAA"
            //   // />
            // }
            {...yAxis}
          />
        )}
        {Object.keys(pies).map((key) => (
          <Pie key={key} data={data} dataKey={key} {...pies[key]} {...DEFAULTVALUES[type]}>
            {data.map((d, i) => (
              <Cell key={`cell-${i}`} fill={d.color} />
            ))}
          </Pie>
        ))}
        <Tooltip {...tooltip} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default Chart;
