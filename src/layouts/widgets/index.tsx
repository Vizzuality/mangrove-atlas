import { PropsWithChildren } from 'react';

import LocationWidget from 'containers/location-widget';

const WidgetsLayout = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <div className="h-full py-14 scrollbar-hide md:absolute md:top-0 md:left-3 md:w-[550px] md:overflow-y-auto md:bg-transparent print:bg-transparent">
      <LocationWidget />
      {children}
    </div>
  );
};

export default WidgetsLayout;
