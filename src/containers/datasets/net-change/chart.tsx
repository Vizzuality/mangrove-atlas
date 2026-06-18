import Chart from '@/components/chart';
import Brush from '@/components/chart/brush';

import NetChangeLegend from './legend';

const BRUSH_HEIGHT = 72;
// Left/right room so the brush handles (and their triangles, which extend past
// the handle by ~5px) stay visible at the first/last index instead of being
// clipped at the SVG edge. Track margin matches so bars align with the brush.
const BRUSH_MARGIN = { top: 4, right: 20, bottom: 4, left: 15 };

const NetChangeChart = ({ config }) => {
  // The brush spans the full series and drives the selection; the chart above
  // shows only the selected window (config.data).
  const brushData = config.brush?.data;
  const showBrush = !!config.brush && !!brushData?.length;

  return (
    <div>
      <NetChangeLegend />
      <Chart config={config} />
      {showBrush && (
        <div className="relative mt-4 w-full" style={{ height: BRUSH_HEIGHT }}>
          {/* Mini histogram track (full series) behind the brush overlay. */}
          <Chart
            className="pointer-events-none absolute inset-0"
            config={{
              type: 'composed',
              data: brushData,
              barCategoryGap: 0,
              barGap: 0,
              height: BRUSH_HEIGHT,
              margin: BRUSH_MARGIN,
              chartBase: {
                bars: config.chartBase.bars,
                lines: config.chartBase.lines,
              },
            }}
          />
          {/* Brush selection overlay — styles untouched. */}
          <div className="absolute inset-0">
            <Brush
              data={brushData}
              width="100%"
              height={BRUSH_HEIGHT}
              margin={BRUSH_MARGIN}
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
