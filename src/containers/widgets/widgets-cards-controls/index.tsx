import { FC } from 'react';

import cn from 'lib/classnames';

import { locationToolAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import ExpandCollapseWidgets from 'containers/widgets/widgets-cards-controls/expand-collapse-widgets';
import WidgetsDeck from 'containers/widgets/widgets-cards-controls/widgets-deck';

const WidgetsCardsControls: FC = () => {
  const locationTool = useRecoilValue(locationToolAtom);
  return (
    <div className="py-1">
      <div
        className={cn({
          'grid w-full grid-cols-2 justify-between gap-1 print:hidden': true,
          hidden: locationTool === 'area' || locationTool === 'upload',
        })}
      >
        <WidgetsDeck />

        <ExpandCollapseWidgets />
      </div>
    </div>
  );
};

export default WidgetsCardsControls;
