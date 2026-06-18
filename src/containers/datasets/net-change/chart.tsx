import Chart from '@/components/chart';

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
  // shows only the selected window (config.data). Rendered through the shared
  // Chart `customBrush` path, identical to the alerts widget.
  const showBrush = !!configBrush && !!configBrush.data?.length;

  return (
    <div>
      <NetChangeLegend />
      <Chart config={config} />
      {showBrush && (
        <Chart
          config={{
            ...configBrush,
            onBrushEnd,
            startIndex: configBrush.customBrush?.startIndex,
            endIndex: configBrush.customBrush?.endIndex,
          }}
        />
      )}
    </div>
  );
};

export default NetChangeChart;
