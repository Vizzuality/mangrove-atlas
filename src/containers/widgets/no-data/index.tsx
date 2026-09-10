import { useReportNoData } from '@/containers/print-report/no-data-context';

import NO_DATA_SVG from '@/svgs/ui/no-data';

const NoData = () => {
  // No-op outside the print report; there it drops the whole card.
  useReportNoData();

  return (
    <div className="m-auto flex w-full max-w-full break-inside-avoid flex-col items-center justify-center rounded-3xl bg-white py-8">
      <NO_DATA_SVG className="h-40 w-40 fill-current" aria-hidden="true" />
      <p className="text-center font-sans text-xs leading-5 sm:text-base sm:leading-6">
        Sorry, there are <b>no data</b> for this location.
        <br />
        Try another one.
      </p>
    </div>
  );
};

export default NoData;
