import { trackEvent } from '@/lib/analytics/ga';

import { activeGuideAtom } from '@/store/guide';
import { netChangeEndYear, netChangeStartYear } from '@/store/widgets/net-change';

import { useAtomValue } from 'jotai';

import { useMangroveHabitatExtent } from '@/containers/datasets/habitat-extent/hooks';
import { useMangroveNetChange } from '@/containers/datasets/net-change/hooks';
import { INFO } from '@/containers/datasets/registries';
import Helper from '@/containers/help/helper';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
import MarkdownText from '@/components/ui/markdown';

import INFO_SVG from '@/svgs/ui/info';

import { HELPER_POSITION } from './constants';

// Widgets whose info panel shows a data-driven year range (GMW-1039). The year
// list is not hardcoded in the .mdx — each resolver reads the widget's own React
// Query cache (already warm from the mounted widget; the query key excludes year
// params, so `{}` hits the same cache with no extra request) and passes min/max
// years as props into the MDX component.
type YearInfoProps = { Info: React.FC<Record<string, unknown>> };

const toYearProps = (years?: number[]) => {
  const sorted = [...(years ?? [])].sort((a, b) => a - b);
  return { years: sorted, minYear: sorted[0], maxYear: sorted.at(-1) };
};

const HabitatExtentYearInfo = ({ Info }: YearInfoProps) => {
  const { data } = useMangroveHabitatExtent({});
  return <Info {...toYearProps(data?.years)} />;
};

const NetChangeYearInfo = ({ Info }: YearInfoProps) => {
  // Mirror useSources: params carry the selected range, but the query key omits
  // it, so this reads the same cached response regardless of the values.
  const startYear = useAtomValue(netChangeStartYear);
  const endYear = useAtomValue(netChangeEndYear);
  const { years } = useMangroveNetChange({ startYear, endYear });
  return <Info {...toYearProps(years)} />;
};

const YEAR_INFO: Record<string, React.FC<YearInfoProps>> = {
  mangrove_habitat_extent: HabitatExtentYearInfo,
  mangrove_net_change: NetChangeYearInfo,
};

const Info = ({ id, content }) => {
  const Info = INFO[id];
  const YearInfo = id ? YEAR_INFO[id] : undefined;
  const isHelpGuideActive = useAtomValue(activeGuideAtom);
  if (!Info && !content) return null;

  // Google Analytics tracking
  const handleAnalytics = () => {
    trackEvent(`Widget Info - ${id}`, {
      category: 'Widget iteration',
      action: 'widget info',
      label: `Info for widget ${id}`,
    });
  };

  const decodedContent = typeof content === 'string' ? <MarkdownText content={content} /> : content;

  return (
    <Dialog onOpenChange={handleAnalytics}>
      <Helper
        className={{
          button: HELPER_POSITION,
          tooltip: 'w-fit-content max-w-100',
        }}
        tooltipPosition={{ top: -35, left: 0 }}
        message="Click to find background information about a widget or map layer, including an overview, date of publication, authors, license, and associated publications."
      >
        <DialogTrigger
          disabled={isHelpGuideActive}
          aria-label="Widget info"
          className="border-brand-800/20 text-brand-800 flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-full border-2 fill-current text-sm"
        >
          <INFO_SVG className="text-brand-800 fill-current" aria-hidden="true" />
        </DialogTrigger>
      </Helper>
      <DialogContent className="w-screen md:mb-20 md:w-auto">
        <DialogTitle className="sr-only">Info</DialogTitle>
        <div className="no-scrollbar overflow-y-auto">
          {/* Supports external content or look by id for static info about widgets */}
          {id && (YearInfo ? <YearInfo Info={Info} /> : <Info />)}
          {content && <>{decodedContent}</>}
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default Info;
