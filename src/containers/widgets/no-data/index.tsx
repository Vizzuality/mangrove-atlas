import Icon from 'components/icon';

import NO_DATA_SVG from 'svgs/no-data.svg?sprite';

const NoData = () => {
  return (
    <div className="w-[540px]">
      <div className="m-auto flex min-h-[334px] max-w-full break-inside-avoid flex-col items-center justify-center rounded-[20px] bg-white pt-8 pr-5 pl-10">
        <Icon className="h-40 w-40" icon={NO_DATA_SVG} />
        <p>
          Sorry, there are <b>no data</b> for this location.
          <br />
          Try with another category.
        </p>
      </div>
    </div>
  );
};

export default NoData;
