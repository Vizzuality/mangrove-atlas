import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';

import PopupRestorationSitesCollapsibleItemTitle from './item-title';
import PopupRestorationSitesCollapsibleItemInfo from './item-info';
import { trackEvent } from 'lib/analytics/ga';
import { ScrollArea } from 'components/ui/scroll-area';

const PopupRestorationSitesCollapsibleItem = ({
  title,
  info,
}: {
  title: string;
  info: string[];
}) => {
  // Google Analytics tracking
  const handleAnalytics = () => {
    trackEvent(`restoration sites pop up - expand/collapse`, {
      action: 'expand/collapse restoration sites pop up',
      label: `restoration sites pop up - expand/collapse`,
    });
  };

  return (
    <Collapsible onOpenChange={handleAnalytics} defaultOpen>
      <CollapsibleTrigger
        iconType="arrow"
        iconSize="sm"
        className="w-full justify-start space-x-2 p-0"
      >
        <PopupRestorationSitesCollapsibleItemTitle title={title} />
      </CollapsibleTrigger>
      <CollapsibleContent className="relative">
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-2 bg-gradient-to-b from-white to-transparent" />

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-2 bg-gradient-to-t from-white to-transparent" />
        <ScrollArea className="relative max-h-[60px] w-full grow overflow-y-auto overflow-x-hidden py-1">
          <ul>
            {info?.map((item, index) => (
              <li key={index} className="w-full space-x-2 font-sans">
                <span className="text-xs font-extralight text-black/85">–</span>
                <PopupRestorationSitesCollapsibleItemInfo info={item} />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PopupRestorationSitesCollapsibleItem;
