import RestorationDataGroup from 'containers/datasets/restoration/map-popup/restoration-data-group';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
import type { RestorationPopUp } from 'types/map';
import { trackEvent } from 'lib/analytics/ga';

const EcosystemServices = ({ data }: { data: RestorationPopUp }) => {
  const { SOC, AGB, Fish_Score_Inv, Fish_Score } = data;

  const handleAnalytics = () => {
    // Google Analytics tracking
    trackEvent(`restoration ecosystem services pop up - expand/collapse`, {
      category: 'Map popup iteration',
      action: 'Expand / Collapse',
      label: `restoration ecosystem services pop up - expand/collapse`,
    });
  };
  return (
    <Collapsible className="w-full" onOpenChange={handleAnalytics}>
      <CollapsibleTrigger iconType="plus-minus">
        <div className="flex w-full flex-col space-y-0.5 text-start">
          <h3 className={WIDGET_SUBTITLE_STYLE}>ECOSYSTEM SERVICES</h3>
          <p className="text-sm font-light">for restored mangroves</p>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <section className="flex w-full flex-col space-y-2 border-none px-6 pb-6 shadow-none">
          <div className="w-fit-content grid grid-flow-col grid-rows-2 gap-2">
            <RestorationDataGroup label="Mean soil organic carbon" value={SOC} unit="mtCO₂e" />
            <RestorationDataGroup label="Mean aboveground carbon" value={AGB} unit="mtCO₂e" />

            <RestorationDataGroup
              label="Commercial invert catch
             enhancement value"
              value={Fish_Score_Inv}
            />
            <RestorationDataGroup
              label="Commercial fish catch
             enhancement value"
              value={Fish_Score}
            />
          </div>
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EcosystemServices;
