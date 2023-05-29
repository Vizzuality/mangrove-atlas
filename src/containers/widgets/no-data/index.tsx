import Icon from 'components/icon';

import NO_DATA_SVG from 'svgs/ui/no-data.svg?sprite';

const NoData = () => {
  return (
    <div className="m-auto ml-[3%] flex min-h-[334px] w-[94%] max-w-full break-inside-avoid flex-col items-center justify-center rounded-[20px] bg-white pt-8 pr-5 pl-10 shadow-widget md:ml-0 md:w-[540px]">
      <Icon className="h-40 w-40" icon={NO_DATA_SVG} />
      {/* md:h-fit-content ml-[3%] w-[94%] rounded-2xl border border-[#DADED0] bg-white px-1 py-1 shadow-widget md:ml-0 md:w-[540px] */}
      <p className="text-center font-sans text-xs leading-5 sm:text-base sm:leading-6">
        Sorry, there are <b>no data</b> for this location.
        <br />
        Try with another category.
      </p>
    </div>
  );
};

export default NoData;
