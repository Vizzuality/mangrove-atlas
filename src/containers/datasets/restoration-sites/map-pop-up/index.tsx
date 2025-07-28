import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { trackEvent } from 'lib/analytics/ga';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';

import PopupRestorationSitesItem from './item';
import { RestorationSitesPopUp } from 'types/map';

const PopupRestorationSites = ({ info }: { info: RestorationSitesPopUp }) => {
  // Google Analytics tracking
  const handleAnalytics = () => {
    trackEvent(`restoration sites pop up - expand/collapse`, {
      action: 'expand/collapse restoration sites pop up',
      label: `restoration sites pop up - expand/collapse`,
    });
  };

  return (
    <Collapsible className="min-w-[375px]" onOpenChange={handleAnalytics}>
      <CollapsibleTrigger iconType="plus-minus">
        <h3 className={WIDGET_SUBTITLE_STYLE}>RESTORATION SITES</h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex w-full flex-col space-y-2 border-none px-6 pb-6 font-sans shadow-none">
          {info.cluster && (
            <p className="text-sm text-black/85">
              <span>
                There are <strong>{info.point_count}</strong> restoration sites in this location.{' '}
              </span>
              <span className="font-extralight">Zoom in to view more details about each site</span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 font-sans">
            {Object.entries(info).map(([key, value]) => (
              <PopupRestorationSitesItem title={key} info={value as string | string[]} />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PopupRestorationSites;
