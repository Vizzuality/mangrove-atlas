import Chart from '@/components/chart';
import Brush from '@/components/chart/brush';

import NetChangeLegend from './legend';

const NetChangeChart = ({ config }) => {
  return (
    <div>
      <NetChangeLegend />
      <Chart config={config} />
      {config.brush && !!config.data?.length && (
        <Brush
          data={config.data}
          width="100%"
          height={72}
          startIndex={config.brush.startIndex}
          endIndex={config.brush.endIndex}
          onBrushEnd={config.brush.onBrushEnd}
        />
      )}
    </div>
  );
};

export default NetChangeChart;
