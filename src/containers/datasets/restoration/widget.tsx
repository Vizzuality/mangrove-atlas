import useIsPrintReport from '@/containers/print-report/use-is-print-report';

import PotentialBenefitsToFisheries from './fisheries/widget';
import Loss from './loss/widget';
import MeanRestoration from './overview/mean-restoration/widget';
import RestorableAreas from './overview/restorable-areas/widget';
import Overview from './overview/widget';
import RestorationValue from './restoration-value/widget';

const Restoration = () => {
  const isPrintReport = useIsPrintReport();

  // Stacked, this widget runs longer than a printed page on its own. The report
  // lifts the overview's two sections out of their nesting and lays all five in
  // two columns, so the card reads across the page instead of down it.
  if (isPrintReport) {
    return (
      <div className="restoration-print grid grid-cols-2 items-start gap-x-8 gap-y-6 [&>*]:break-inside-avoid [&>*:last-child]:col-span-2">
        <MeanRestoration />
        <RestorableAreas />
        <Loss />
        <RestorationValue />
        <PotentialBenefitsToFisheries />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Overview />
      <Loss />
      <RestorationValue />
      <PotentialBenefitsToFisheries />
    </div>
  );
};

export default Restoration;
