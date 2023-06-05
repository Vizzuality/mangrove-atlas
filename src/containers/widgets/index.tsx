import { useCallback } from 'react';

import cn from 'lib/classnames';

import { widgetsCollapsedAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import WidgetsLayout from 'layouts/widgets';

import { WIDGETS } from 'containers/datasets';
import WidgetWrapper from 'containers/widget';
import NoData from 'containers/widgets/no-data';

import { useWidgets } from './hooks';

const WidgetsContainer: React.FC = () => {
  const widgets = useWidgets();
  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const widgetsCollapsedChecker = Object.values(widgetsCollapsed).includes(true);

  const handleWidgetsCollapsed = useCallback(() => {
    const updateWidgetsCollapsed = Object.keys(widgetsCollapsed).reduce((acc, key) => {
      acc[key] = widgetsCollapsedChecker ? false : true;
      return acc;
    }, {});

    setWidgetsCollapsed(updateWidgetsCollapsed);
  }, [widgetsCollapsed, widgetsCollapsedChecker, setWidgetsCollapsed]);

  return (
    <WidgetsLayout>
      {widgets.length > 1 && (
        <button
          className={cn({
            'mb-20 ml-[3%] w-48 rounded-3xl border-2 border-black border-opacity-20 py-2 px-4 font-sans text-sm font-semibold text-black/85 transition-colors md:ml-0 md:translate-x-44':
              true,
            'border-white bg-white text-brand-800': widgetsCollapsedChecker,
          })}
          onClick={() => handleWidgetsCollapsed()}
        >
          {widgetsCollapsedChecker ? 'Expand all widgets' : 'Collapse all widgets'}
        </button>
      )}
      {widgets.map(({ slug, name }, ind) => {
        const Widget = WIDGETS[slug];
        return (
          <WidgetWrapper
            key={slug}
            title={name}
            id={slug}
            className={cn({
              [`z-[${40 + ind * 10}]`]: true,
            })}
          >
            {WIDGETS[slug] && <Widget />}
          </WidgetWrapper>
        );
      })}

      {widgets.length === 0 && <NoData />}
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
