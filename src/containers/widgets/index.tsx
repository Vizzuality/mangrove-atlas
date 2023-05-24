import cn from 'lib/classnames';

import WidgetsLayout from 'layouts/widgets';

import { WIDGETS } from 'containers/datasets';
import WidgetWrapper from 'containers/widget';

import { useWidgets } from './hooks';

const WidgetsContainer: React.FC = () => {
  const widgets = useWidgets();
  return (
    <WidgetsLayout>
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
