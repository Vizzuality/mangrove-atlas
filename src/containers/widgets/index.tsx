import cn from 'lib/classnames';

import { allWidgetsCollapsedAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import WidgetsLayout from 'layouts/widgets';

import { WIDGETS } from 'containers/datasets';
import WidgetWrapper from 'containers/widget';

import { Media } from 'components/media-query';

import { useWidgets } from './hooks';

const WidgetsContainer: React.FC = () => {
  const widgets = useWidgets();
  const [allWidgetsCollapsed, setAllWidgetsCollapsed] = useRecoilState(allWidgetsCollapsedAtom);

  return (
    <WidgetsLayout>
      <Media lessThan="md">
        <button
          className="ml-[3%] mb-4 rounded-3xl border-2 border-black border-opacity-20 py-2 px-4 font-sans text-sm font-semibold text-black/85"
          onClick={() => setAllWidgetsCollapsed(!allWidgetsCollapsed)}
        >
          {allWidgetsCollapsed ? 'Collapse all widgets' : 'Expand all widgets'}
        </button>
      </Media>

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
