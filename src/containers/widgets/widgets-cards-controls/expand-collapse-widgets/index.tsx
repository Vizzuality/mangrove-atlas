import { useCallback, FC } from 'react';

import cn from 'lib/classnames';

import { widgetsCollapsedAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';
import { useWindowSize } from 'usehooks-ts';

import Helper from 'containers/help/helper';
import { widgets } from 'containers/widgets/constants';

import { breakpoints } from 'styles/styles.config';

const ExpandCollapseWidgets: FC = () => {
  const { width: screenWidth } = useWindowSize();

  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const widgetsCollapsedChecker = Object.values(widgetsCollapsed)?.includes(true);

  const handleWidgetsCollapsed = useCallback(() => {
    const updateWidgetsCollapsed = Object.keys(widgetsCollapsed).reduce((acc, key) => {
      acc[key] = widgetsCollapsedChecker ? false : true;
      return acc;
    }, {});

    updateWidgetsCollapsed['widgets_deck_tool'] = false;
    updateWidgetsCollapsed['mangrove_drawing_tool'] = false;
    updateWidgetsCollapsed['mangrove_drawing_upload_tool'] = false;

    setWidgetsCollapsed(updateWidgetsCollapsed);
  }, [widgetsCollapsed, widgetsCollapsedChecker, setWidgetsCollapsed]);

  return (
    <Helper
      className={{
        button: '-top-1.5 right-0 z-20',
        tooltip: 'max-w-[400px]',
      }}
      tooltipPosition={{ top: -50, left: -10 }}
      message="Collapse widget deck so that only widget titles are showing or expand widget deck so that all available information is viewable. "
    >
      <button
        type="button"
        data-testid="expand-collapse-button"
        className={cn({
          'h-8 w-full rounded-4xl bg-white px-4 py-1 font-sans text-sm font-semibold text-brand-800 shadow-control transition-colors disabled:text-opacity-60 md:ml-0 md:w-[262px]':
            true,
          'bg-white': widgetsCollapsedChecker,
          'print:hidden': screenWidth >= breakpoints.md,
        })}
        disabled={widgets.length <= 1}
        onClick={handleWidgetsCollapsed}
      >
        {widgetsCollapsedChecker ? 'Expand all widgets' : 'Collapse all widgets'}
      </button>
    </Helper>
  );
};

export default ExpandCollapseWidgets;
