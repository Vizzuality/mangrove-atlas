import { useCallback, useState } from 'react';

import type { Data } from '@/containers/datasets/restoration/overview/types';
import Legend from '@/containers/legend';

import TRIANGLE_SVG from '@/svgs/ui/triangle';

import MANGROVE_RESTORATION_POTENTIAL_CHART_LABELS from './constants';

const RestorationOverviewChart = ({
  restoration_potential_score, // restorationData?.restoration_potential_score
}: Partial<Data>) => {
  const [lineChartWidth, setLineChartWidth] = useState(0);
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node?.offsetWidth) setLineChartWidth(node.offsetWidth);
  }, []);

  const trianglePosition = (lineChartWidth * restoration_potential_score) / 100 - 7; // substract icon size

  return (
    <div className="mb-6 flex flex-1 flex-col items-center space-y-10">
      <Legend items={MANGROVE_RESTORATION_POTENTIAL_CHART_LABELS} variant="horizontal" />
      <div
        ref={ref}
        className="relative h-7 w-full"
        style={{
          background:
            'linear-gradient(90deg, #F9DDDA 0%, #FFADAD 25.52%, #CE78B3 50.52%, #8478CE 78.13%, #224294 100%)',
        }}
      >
        <TRIANGLE_SVG
          className="absolute -top-5 left-1/2 inline-block h-4 w-5 -translate-x-1/2 fill-current"
          role="img"
          aria-hidden={true}
          style={{ left: !!trianglePosition && trianglePosition }}
        />
      </div>
      <hr className={'widgetStyles.breakLineDashed'} />
    </div>
  );
};

export default RestorationOverviewChart;
