import cn from 'lib/classnames';

import NoData from 'containers/widgets/no-data';

import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import { useNationalDashboard } from './hooks';
import OtherResources from './other-resources';
import { useLocation } from '../locations/hooks';

import Sources from './sources';
import LegalStatus from './legal-status';
import MangroveBreakthrough from './mangrove-breakthrough';

const NationalDashboard = () => {
  const { data, isLoading, isFetching, isFetched } = useNationalDashboard();

  const ISO = data?.locationIso;
  const { data: location } = useLocation(ISO);

  if (isFetched && !data?.data.length) return <NoData />;

  return (
    <div className={cn(WIDGET_CARD_WRAPPER_STYLE)}>
      <Loading visible={isLoading && !isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && !isFetching && data && (
        <div className="space-y-[25px]">
          {!data?.data?.legal_status && (
            <LegalStatus location={location.name} legalStatus={data?.data?.legal_status} />
          )}
          <Sources data={data?.data} iso={ISO} />
          {!!data?.metadata?.other_resources.length && (
            <OtherResources resources={data?.metadata?.other_resources} />
          )}
          {!!data?.data?.mangrove_breakthrough_committed && (
            <>
              <div className="absolute left-4 right-4 h-0.5 bg-brand-800/30" />

              <MangroveBreakthrough
                location={location.name}
                mangroveBreakthrough={data?.data?.mangrove_breakthrough_committed}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NationalDashboard;
