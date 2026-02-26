import { trackEvent } from '@/lib/analytics/ga';

import { activeGuideAtom } from '@/store/guide';

import { useRecoilValue } from 'recoil';

import { INFO } from '@/containers/datasets';
import Helper from '@/containers/help/helper';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';

import INFO_SVG from '@/svgs/ui/info';

import { HELPER_POSITION } from './constants';

const Info = ({ id, content }) => {
  const Info = INFO[id];
  const isHelpGuideActive = useRecoilValue(activeGuideAtom);
  if (!Info && !content) return null;

  // Google Analytics tracking
  const handleAnalytics = () => {
    trackEvent(`Widget Info - ${id}`, {
      category: 'Widget iteration',
      action: 'widget info',
      label: `Info for widget ${id}`,
    });
  };

  return (
    <Dialog onOpenChange={handleAnalytics}>
      <Helper
        className={{
          button: HELPER_POSITION,
          tooltip: 'w-fit-content max-w-[400px]',
        }}
        tooltipPosition={{ top: -35, left: 0 }}
        message="Click to find background information about a widget or map layer, including an overview, date of publication, authors, license, and associated publications."
      >
        <DialogTrigger disabled={isHelpGuideActive} className="flex h-full items-center">
          <INFO_SVG className="text-brand-800 h-7.5 w-7.5 fill-current" role="img" title="Info" />
        </DialogTrigger>
      </Helper>
      <DialogContent className="w-screen md:mb-20 md:w-auto">
        <DialogTitle className="sr-only">Info</DialogTitle>
        <div className="no-scrollbar overflow-y-auto">
          {/* Supports external content or look by id for static info about widgets */}
          {id && <Info />}
          {content && <p>{content}</p>}
        </div>
        <DialogClose className="md:0 -top-2 md:absolute" />
      </DialogContent>
    </Dialog>
  );
};

export default Info;
