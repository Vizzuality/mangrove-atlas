import { createRef, useLayoutEffect, useState } from 'react';

import type { Data } from 'containers/datasets/restoration/overview/types';
import Legend from 'containers/legend';

import Icon from 'components/ui/icon';

import TRIANGLE_SVG from 'svgs/ui/triangle.svg?sprite';

import MANGROVE_RESTORATION_POTENTIAL_CHART_LABELS from './constants';

const RestorationOverviewChart = ({
  restoration_potential_score, // restorationData?.restoration_potential_score
}: Partial<Data>) => {
  const ref = createRef<HTMLDivElement>();
  const [lineChartWidth, setLineChartWidth] = useState(0);

  const trianglePosition = (lineChartWidth * restoration_potential_score) / 100 - 7; // substract icon size

  // fires synchronously after all DOM mutations.
  useLayoutEffect(() => {
    if (ref && ref.current && ref.current.offsetWidth) {
      setLineChartWidth(ref?.current?.offsetWidth);
    }
  }, [ref]);

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
        <Icon
          icon={TRIANGLE_SVG}
          className="absolute -top-5 left-1/2 inline-block h-4 w-5 -translate-x-1/2"
          style={{ left: !!trianglePosition && trianglePosition }}
        />
      </div>
      <hr className={'widgetStyles.breakLineDashed'} />
    </div>
  );
};

export default RestorationOverviewChart;
