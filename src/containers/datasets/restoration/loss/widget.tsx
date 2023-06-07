import cn from 'lib/classnames';
import { numberFormat } from 'lib/format';

import { TreemapNode } from 'recharts/types/util/types';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPER_STYLE } from 'styles/widgets';

import LossChart from './chart';
import { useMangroveDegradationAndLoss } from './hooks';
import type { ChartData } from './types';
const CustomizedContent = (props: TreemapNode & { data: ChartData[] }) => {
  const { depth, x, y, width, height, data, label, root } = props;
  if (!data) return null;
  const color =
    depth >= 2 && root?.children?.find((child) => child?.indicator === props?.indicator).color;
  return (
    <g>
      {depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
        >
          {label}
        </text>
      ) : null}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          zIndex: 0,
          fill: depth < 2 ? '#EB6240' : color,
          stroke: 'white',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
    </g>
  );
};
const LossWidget = () => {
  const { data, isFetched, isFetching } = useMangroveDegradationAndLoss();

  if (!data) return null;
  const config = {
    width: 175,
    height: 175,
    name: 'indicator',
    data: data?.chartData,
    dataKey: 'value',
    chartBase: {
      type: 'tree',
      dataKey: 'value',
      tree: true,
    },
    yKeys: { tree: true },
    content: (props) => <CustomizedContent data={data?.chartData} {...props} />,
    legend: {
      title: 'Total area loss',
      subtitle: `(${numberFormat(
        data?.chartData?.[0].children.reduce(
          (acc: number, curr: { value: number }) => acc + curr.value,
          0
        )
      )} ${data?.unit})`,
      items: data?.chartData?.[0].children,
    },
  };

  return (
    <div
      className={cn({
        [WIDGET_CARD_WRAPER_STYLE]: true,
        relative: true,
      })}
    >
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <div className="space-y-4">
          <h3 className="text-xs">MANGROVE LOSS</h3>
          <p className="text-lg font-light leading-7">
            The main restorable loss driver in
            <span className="font-bold"> {data?.location}</span> is{' '}
            <span className="font-bold">
              {data?.main_loss_driver === 'Commodities'
                ? `${data?.main_loss_driver} (rice, shrimp, and oil palm cultivation)`
                : data?.main_loss_driver}
            </span>
          </p>
          <LossChart config={config} legend={config.legend} />
          {!isFetching && (
            <div className="absolute bottom-4 -left-10 -right-10 border-2 border-b border-brand-800/30" />
          )}
        </div>
      )}
    </div>
  );
};

export default LossWidget;
