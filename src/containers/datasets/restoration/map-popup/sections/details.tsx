import Detail from 'containers/datasets/restoration/map-popup/detail';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
import type { RestorationPopUp } from 'types/map';
import { trackEvent } from 'lib/analytics/ga';
const Details = ({ data }: { data: RestorationPopUp }) => {
  const {
    Tidal_range,
    Tidal_range1,
    Ant_SLR,
    Ant_SLR1,
    Future_SLR,
    Future_SLR1,
    Time_Loss,
    Time_Loss1,
    Flow_Group,
    Flow_Group1,
    Med_Patch,
    Med_Patch_1,
    Contig_Group,
    Contig_Group1,
  } = data;

  const handleAnalytics = () => {
    // Google Analytics tracking
    trackEvent(`restoration details pop up - expand/collapse`, {
      action: 'expand/collapse restoration details pop up',
      label: `restoration details pop up - expand/collapse`,
    });
  };
  return (
    <Collapsible className="w-full" onOpenChange={handleAnalytics}>
      <CollapsibleTrigger>
        <h3 className={WIDGET_SUBTITLE_STYLE}>DETAILS</h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <section className="flex w-full flex-col space-y-2 border-none px-6 pb-6 shadow-none">
          <div className="flex w-full grow flex-col items-center justify-between">
            <Detail label="Tidal range" pct={Tidal_range1} value={Tidal_range} />
            <Detail label="Antecedent SLR" pct={Ant_SLR1} value={Ant_SLR} />
            <Detail label="Future SLR" pct={Future_SLR1} value={Future_SLR} />
            <Detail label="Timing of loss" pct={Time_Loss1} value={Time_Loss} />
            <Detail label="Hydrological disturbance" pct={Flow_Group1} value={Flow_Group} />
            <Detail label="Patch size and number" pct={Med_Patch_1} value={Med_Patch} />
            <Detail label="Patch connectivity" pct={Contig_Group1} value={Contig_Group} unit="%" />
          </div>
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Details;
