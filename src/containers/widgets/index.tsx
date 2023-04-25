import WidgetLayout from 'layouts/widget';
import WidgetsLayout from 'layouts/widgets';

import widgets from './constants';
const WidgetsContainer: React.FC = () => {
  return (
    <WidgetsLayout>
      {widgets.map(({ slug, name }) => (
        <WidgetLayout key={slug} title={name} id={slug}>
          <></>
        </WidgetLayout>
      ))}
    </WidgetsLayout>
  );
};

export default WidgetsContainer;
