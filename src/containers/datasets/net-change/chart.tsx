import Chart from '@/components/chart';
import Brush from '@/components/chart/brush';

import NetChangeLegend from './legend';

const NetChangeChart = ({
  config,
  configBrush,
  onBrushEnd,
}: {
  config: any;
  configBrush?: any;
  onBrushEnd?: (payload: { startIndex: number; endIndex: number }) => void;
}) => {
  // The brush spans the full series and drives the selection; the chart above
  // shows only the selected window (config.data).
  const showBrush = !!configBrush && !!configBrush.data?.length;

  return (
    <div>
      <NetChangeLegend />
      <Chart config={config} />
      {showBrush && (
        <div className="relative mt-4 w-full" style={{ height: configBrush.height }}>
          {/* Mini histogram track (full series) + year axis behind the brush. */}
          <Chart
            className="pointer-events-none absolute inset-0"
            config={{
              type: configBrush.type,
              data: configBrush.data,
              barCategoryGap: configBrush.barCategoryGap,
              barGap: configBrush.barGap,
              height: configBrush.height,
              margin: configBrush.margin,
              xKey: configBrush.xKey,
              xAxis: configBrush.xAxis,
              chartBase: configBrush.chartBase,
            }}
          />
          {/* Brush selection overlay — styles untouched. */}
          <div className="absolute inset-0">
            <Brush
              data={configBrush.data}
              width="100%"
              height={configBrush.height}
              margin={configBrush.overlayMargin}
              startIndex={configBrush.startIndex}
              endIndex={configBrush.endIndex}
              onBrushEnd={onBrushEnd}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NetChangeChart;
