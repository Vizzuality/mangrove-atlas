'use client';

import {
  useGetMRTTSitesGeometries,
  useGetUserSites,
} from '@/containers/datasets/locations/user-locations';

import Loading from 'components/ui/loading';

import SitesItem from './item';
import { groupSitesByLandscape } from './utils';

/**
 * MRTT sites the signed-in user can access, listed in their own section of the
 * saved-areas panel. Unlike saved areas they are read-only here: created and deleted
 * from the Mangrove Restoration Tracker Tool only.
 */
const UserMRTTSites = () => {
  const {
    data: landscapes,
    isLoading,
    isError,
  } = useGetUserSites({
    select: groupSitesByLandscape,
  });
  const {
    data: geometries,
    isLoading: isLoadingGeometries,
    isError: isGeometriesError,
  } = useGetMRTTSitesGeometries();

  // A user outside any MRTT organisation (or an endpoint error) just has no sites to
  // show — the saved-areas list above still works, so render nothing instead of an error.
  if (!isLoading && (isError || !landscapes?.length)) return null;

  return (
    <section aria-labelledby="mrtt-sites-heading" className="flex flex-col space-y-4 py-4">
      <div className="space-y-1">
        <h3 id="mrtt-sites-heading" className="text-lg">
          MRTT sites
        </h3>
        <p className="text-sm text-black/60">
          Sites from the Mangrove Restoration Tracker Tool. Select one to analyse it. Sites can only
          be edited or deleted in the MRTT.
        </p>
      </div>

      {isLoading ? (
        <div
          role="status"
          aria-label="Loading MRTT sites"
          className="flex w-full items-center justify-center py-8"
        >
          <Loading iconClassName="w-10 h-10 self-center" />
        </div>
      ) : (
        landscapes.map((landscape) => (
          <div key={landscape.landscape_id} className="w-full text-xs">
            <h4 className="py-2 uppercase">{landscape.landscape_name}</h4>
            <ul
              aria-label={`Sites in ${landscape.landscape_name}`}
              className="flex w-full flex-col space-y-3"
            >
              {landscape.sites.map((site) => (
                <SitesItem
                  key={site.id}
                  id={site.id}
                  name={site.site_name}
                  geometry={geometries?.[site.id] ?? null}
                  geometryStatus={
                    isLoadingGeometries ? 'loading' : isGeometriesError ? 'error' : 'ready'
                  }
                />
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
};

export default UserMRTTSites;
