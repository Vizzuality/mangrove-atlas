import Icon from 'components/icon';

import NO_DATA_SVG from 'svgs/ui/no-data.svg?sprite';

const NoData = () => {
  return (
    <div className="m-auto flex w-full max-w-full break-inside-avoid flex-col items-center justify-center rounded-3xl bg-white py-8">
      <Icon className="h-40 w-40" icon={NO_DATA_SVG} description="No data" />
      <p className="text-center font-sans text-xs leading-5 sm:text-base sm:leading-6">
        Sorry, there are <b>no data</b> for this category.
        <br />
        Try with another location.
      </p>
    </div>
  );
};

export default NoData;
