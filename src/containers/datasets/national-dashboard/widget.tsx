import { useSyncLocation } from 'hooks/use-sync-location';

import Loading from '@/components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import { useLocation } from '../locations/hooks';

import { useNationalDashboard } from './hooks';
import LegalStatus from './legal-status';
import MangroveBreakthrough from './mangrove-breakthrough';
import NoMetadata from './no-metadata';
import OtherResources from './other-resources';
import Sources from './sources';

const Divider = () => <div className="bg-brand-800/30 absolute right-0 left-0 h-0.5" />;

const NationalDashboard = () => {
  const { data, isFetching, isFetched } = useNationalDashboard();

  const { type: locationType, id } = useSyncLocation();
  const { data: location } = useLocation(id, locationType);
  const locationName = location?.name ?? '';

  const indicators = data?.data ?? [];
  const firstIndicator = indicators[0];
  // BE returns an indicator item even when a location only has legal status /
  // breakthrough info, so `indicators.length` alone can't tell if there are sources.
  const hasSources = indicators.some(({ sources }) => sources?.length);
  const otherResources = data?.metadata?.other_resources;

  if (isFetched && !indicators.length) return <NoMetadata />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && !isFetching && data && (
        <div>
          {firstIndicator?.legal_status && locationName && (
            <LegalStatus location={locationName} legalStatus={firstIndicator.legal_status} />
          )}
          {hasSources ? (
            <Sources data={indicators} iso={data.locationIso} />
          ) : (
            <div className="pb-6.25">
              <NoMetadata />
            </div>
          )}
          {!!otherResources?.length && (
            <>
              <Divider />
              <OtherResources resources={otherResources} />
            </>
          )}
          <Divider />
          <MangroveBreakthrough
            location={locationName}
            mangroveBreakthrough={!!firstIndicator?.mangrove_breakthrough_committed}
          />
        </div>
      )}
    </div>
  );
};

export default NationalDashboard;
