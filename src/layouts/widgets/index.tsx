import { PropsWithChildren } from 'react';

import LocationTitle from 'containers/location-title';
const WidgetsLayout = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <div className="h-full py-20 scrollbar-hide md:absolute md:top-0 md:left-3 md:w-[550px] md:overflow-y-auto md:bg-transparent print:bg-transparent">
      <LocationTitle />
      {children}
    </div>
  );
};

export default WidgetsLayout;
