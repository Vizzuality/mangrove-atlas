import { PropsWithChildren } from 'react';

import LocationTitle from 'components/location-title';

const WidgetsLayout = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <div className="absolute top-0 left-0 h-full w-[550px] overflow-y-auto bg-brand-400 py-20 scrollbar-hide md:left-20 md:bg-transparent">
      <LocationTitle />
      {children}
    </div>
  );
};

export default WidgetsLayout;
