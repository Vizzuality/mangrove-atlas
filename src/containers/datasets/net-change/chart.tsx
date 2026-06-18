import Chart from '@/components/chart';
import Brush from '@/components/chart/brush';

import NetChangeLegend from './legend';

const BRUSH_HEIGHT = 72;

const NetChangeChart = ({ config }) => {
  const showBrush = !!config.brush && !!config.data?.length;

  return (
    <div>
      <NetChangeLegend />
      <Chart config={config} />
      {showBrush && (
        <div className="relative mt-4 w-full" style={{ height: BRUSH_HEIGHT }}>
          {/* Mini histogram track behind the brush overlay. */}
          <Chart
            className="pointer-events-none absolute inset-0"
            config={{
              type: 'composed',
              data: config.data,
              barCategoryGap: 0,
              barGap: 0,
              height: BRUSH_HEIGHT,
              margin: { top: 4, right: 20, bottom: 4, left: 0 },
              chartBase: {
                bars: config.chartBase.bars,
                lines: config.chartBase.lines,
              },
            }}
          />
          {/* Brush selection overlay — styles untouched. */}
          <div className="absolute inset-0">
            <Brush
              data={config.data}
              width="100%"
              height={BRUSH_HEIGHT}
              startIndex={config.brush.startIndex}
              endIndex={config.brush.endIndex}
              onBrushEnd={config.brush.onBrushEnd}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NetChangeChart;
