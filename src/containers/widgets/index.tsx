import WidgetsLayout from 'layouts/widgets';

import { WIDGETS } from 'containers/datasets';
import WidgetWrapper from 'containers/widget';

import { useWidgets } from './hooks';

const WidgetsContainer: React.FC = () => {
  const widgets = useWidgets();
  console.log({ widgets });
  return (
    <WidgetsLayout>
      {widgets.map(({ slug, name }) => {
        const Widget = WIDGETS[slug];
        return (
          <WidgetWrapper key={slug} title={name} id={slug}>
            {WIDGETS[slug] && <Widget />}
          </WidgetWrapper>
        );
      })}
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
