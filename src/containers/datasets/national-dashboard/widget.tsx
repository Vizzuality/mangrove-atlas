import cn from '@/lib/classnames';

import NoData from './no-data';

import Loading from '@/components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import { useNationalDashboard } from './hooks';
import OtherResources from './other-resources';
import { useLocation } from '../locations/hooks';

import Sources from './sources';
import LegalStatus from './legal-status';
import MangroveBreakthrough from './mangrove-breakthrough';
import NoMetadata from './no-metadata';

const NationalDashboard = () => {
  const { data, isLoading, isFetching, isFetched } = useNationalDashboard();

  const ISO = data?.locationIso;
  const { data: location } = useLocation(ISO);

  if (
    isFetched &&
    !data?.data?.mangrove_breakthrough_committed &&
    !data?.data?.legal_status &&
    !data?.data.length
  )
    return <NoMetadata />;

  return (
    <div className={cn(WIDGET_CARD_WRAPPER_STYLE)}>
      <Loading visible={isLoading && !isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && !isFetching && data && (
        <div className="space-y-[25px]">
          {!data?.data?.legal_status && process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && (
            <LegalStatus location={location.name} legalStatus={data?.data?.legal_status} />
          )}
          {isFetched && !data?.data.length && <NoData />}
          {isFetched && data?.data.length > 0 && <Sources data={data?.data} iso={ISO} />}

          {!!data?.metadata?.other_resources.length && isFetched && (
            <OtherResources resources={data?.metadata?.other_resources} />
          )}
          {!data?.data?.mangrove_breakthrough_committed &&
            process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && (
              <>
                <div className="bg-brand-800/35 absolute right-0 left-0 h-0.5" />

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
