import cn from 'lib/classnames';

import { widgetsCollapsedAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import WidgetsLayout from 'layouts/widgets';

import { WIDGETS } from 'containers/datasets';
import WidgetWrapper from 'containers/widget';

import { useWidgets } from './hooks';

const WidgetsContainer: React.FC = () => {
  const widgets = useWidgets();
  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const widgetsCollapsedChecker = widgetsCollapsed.map((w) => Object.values(w)[0]).some((w) => !!w);

  const handleWidgetsCollapsed = () => {
    const updateWidgetsCollapsed = widgetsCollapsed.map((w) => ({
      [`${Object.keys(w)}`]: widgetsCollapsedChecker ? false : true,
    }));

    setWidgetsCollapsed(updateWidgetsCollapsed);
  };

  return (
    <WidgetsLayout>
      <button
        className="ml-[3%] mb-4 rounded-3xl border-2 border-black border-opacity-20 py-2 px-4 font-sans text-sm font-semibold text-black/85 md:ml-0"
        onClick={() => handleWidgetsCollapsed()}
      >
        {widgetsCollapsedChecker ? 'Expand all widgets' : 'Collapse all widgets'}
      </button>

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
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
