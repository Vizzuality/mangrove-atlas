import { PropsWithChildren } from 'react';

import LocationWidget from 'containers/location-widget';

const WidgetsLayout = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <div className="left-0 h-full w-screen py-14 scrollbar-hide md:absolute md:top-0 md:w-[560px] md:overflow-y-auto md:bg-transparent md:px-4 print:bg-transparent">
      <LocationWidget />
      {children}
    </div>
  );
};

export default WidgetsLayout;
