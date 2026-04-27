'use client';

import { groupBy } from 'lodash-es';

import { useGetUserSites } from '@/containers/datasets/locations/user-locations';

import Loading from 'components/ui/loading';

import SitesItem from './item';

const UserMRTTSites = () => {
  const { data: sitesData, isLoading: isLoadingSites } = useGetUserSites({
    select: (res) => {
      const grouped = groupBy(res, 'landscape_id');
      return Object.entries(grouped).map(([id, sites]) => ({
        landscape_id: Number(id),
        landscape_name: sites[0].landscape_name,
        sites: sites.map(({ ...site }) => site),
      }));
    },
  });
  return (
    <section aria-label="MRTT sites" className="flex flex-col space-y-4">
      {isLoadingSites ? (
        <div
          role="status"
          aria-label="Loading sites"
          className="flex w-full items-center justify-center py-8"
        >
          <Loading iconClassName="w-10 h-10 self-center" />
        </div>
      ) : (
        sitesData.map((landscape) => (
          <div key={landscape.landscape_id} className="divide w-full gap-4 divide-gray-400 text-xs">
            <h4 className="py-4 uppercase">{landscape.landscape_name}</h4>
            <ul
              aria-label={`Sites in ${landscape.landscape_name}`}
              className="flex w-full flex-col"
            >
              {landscape.sites.map((site) => (
                <SitesItem key={site.id} id={site.id} name={site.site_name} />
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
};

export default UserMRTTSites;
