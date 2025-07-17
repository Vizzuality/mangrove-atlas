import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
import { trackEvent } from 'lib/analytics/ga';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';
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
      <CollapsibleTrigger>
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

          <div className="flex w-full justify-between font-sans">
            {info.site_name && (
              <div className="flex flex-col">
                <span className="text-left text-sm font-semibold text-brand-800">Site</span>
                <span className="text-left text-xxs font-light uppercase leading-5 text-black/85">
                  {info.site_name}
                </span>
              </div>
            )}

            {info.landscape_name && (
              <div className="flex flex-col">
                <span className="text-left text-sm font-semibold text-brand-800">Landscape</span>
                <span className="text-left text-xxs font-light uppercase leading-5 text-black/85">
                  {info.landscape_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PopupRestorationSites;
