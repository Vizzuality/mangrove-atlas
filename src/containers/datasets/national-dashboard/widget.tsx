import { useSyncLocation } from 'hooks/use-sync-location';

import Loading from '@/components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import { useLocation } from '../locations/hooks';

import { useNationalDashboard } from './hooks';
import LegalStatus from './legal-status';
import MangroveBreakthrough from './mangrove-breakthrough';
import NoData from './no-data';
import NoMetadata from './no-metadata';
import OtherResources from './other-resources';
import Sources from './sources';

const NationalDashboard = () => {
  const { data, isFetching, isFetched } = useNationalDashboard();

  const { type: locationType, id } = useSyncLocation();
  const ISO = data?.locationIso;

  const { data: location } = useLocation(id, locationType);
  const locationName = location?.name;

  const firstIndicator = data?.data?.[0];

  if (
    isFetched &&
    !firstIndicator?.mangrove_breakthrough_committed &&
    !firstIndicator?.legal_status &&
    data?.data?.length === 0
  )
    return <NoMetadata />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && !isFetching && data && (
        <div>
          {firstIndicator?.legal_status && locationName && (
            <LegalStatus location={locationName} legalStatus={firstIndicator.legal_status} />
          )}
          {data.data?.length ? <Sources data={data.data} iso={ISO} /> : <NoData />}
          {!!data.metadata?.other_resources?.length && (
            <>
              <div className="bg-brand-800/30 absolute right-0 left-0 h-0.5" />
              <OtherResources resources={data.metadata.other_resources} />
            </>
          )}

          <div className="bg-brand-800/30 absolute right-0 left-0 h-0.5" />
          <MangroveBreakthrough
            location={locationName ?? ''}
            mangroveBreakthrough={!!firstIndicator?.mangrove_breakthrough_committed}
          />
        </div>
      )}
    </div>
  );
};

export default NationalDashboard;
