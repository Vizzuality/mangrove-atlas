'use client';

import { useCallback, useMemo } from 'react';

import Link from 'next/link';

import { highlightedSiteAtom, tmpCameraAtom } from '@/store/map';

import turfBbox from '@turf/bbox';
import type { Geometry } from 'geojson';
import { useSetAtom } from 'jotai';

import { LABELS } from '@/containers/datasets/restoration-sites/constants';
import type { DataDitesProperties } from '@/containers/datasets/restoration-sites/types';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import SvgExternalLink from '@/svgs/ui/external_link';

type BBox = [number, number, number, number];

// ~5km each way. A zero-area bbox would make fitBounds jump to max zoom, so a
// centroid-only site gets framed at neighbourhood scale instead.
const CENTROID_PAD = 0.05;

const parseGeometry = (geometry: string | null): Geometry | null => {
  if (!geometry) return null;
  try {
    return JSON.parse(geometry) as Geometry;
  } catch {
    return null;
  }
};

type Props = {
  id: number;
  name: string;
  // The matching restoration-sites record — geometry plus the detail fields the
  // map popup renders. Undefined until the join resolves.
  site?: DataDitesProperties;
};

const SitesItem = ({ name, id, site }: Props) => {
  const setTmpCamera = useSetAtom(tmpCameraAtom);
  const setHighlightedSite = useSetAtom(highlightedSiteAtom);

  // Polygon when the site has one, otherwise the centroid point — both are drawn
  // by the highlight overlay and both give a camera target.
  const geometry = useMemo(
    () => parseGeometry(site?.site_area ?? null) ?? parseGeometry(site?.site_centroid ?? null),
    [site?.site_area, site?.site_centroid]
  );

  // Only the fields the restoration-sites popup knows how to label.
  const properties = useMemo(() => {
    if (!site) return {};
    return Object.keys(LABELS).reduce<Record<string, string | string[]>>((acc, key) => {
      acc[key] = site[key];
      return acc;
    }, {});
  }, [site]);

  const bbox = useMemo(() => {
    if (!geometry) return null;

    if (geometry.type === 'Point') {
      const [lng, lat] = geometry.coordinates;
      return [
        lng - CENTROID_PAD,
        lat - CENTROID_PAD,
        lng + CENTROID_PAD,
        lat + CENTROID_PAD,
      ] as BBox;
    }

    return turfBbox({ type: 'Feature', properties: {}, geometry }) as BBox;
  }, [geometry]);

  // Camera-only move: an MRTT site is not an Atlas location, so there is no
  // route to navigate to — the map consumes tmpCamera and clears it on settle.
  // The highlight geometry persists until another site is picked.
  const handleFlyToSite = useCallback(() => {
    if (!bbox || !geometry) return;
    setHighlightedSite({ geometry, properties });
    setTmpCamera({ bbox });
  }, [bbox, geometry, properties, setHighlightedSite, setTmpCamera]);

  return (
    <li className="flex items-center justify-between gap-3 py-2">
      {bbox ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              // Which geometry the join resolved — readable in DevTools and in e2e.
              data-geometry-type={geometry?.type}
              aria-label={`Fly to ${name}`}
              className="focus-visible:ring-brand-500 cursor-pointer text-left underline-offset-2 focus-visible:ring-2 focus-visible:outline-none"
              onClick={handleFlyToSite}
            >
              {name}
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-700 px-2 text-white">
            Click to fly to this site.
          </TooltipContent>
        </Tooltip>
      ) : (
        <span>{name}</span>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`${process.env.NEXT_PUBLIC_MRTT_SITE}/sites/${id}/overview`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} (opens in MRTT tool, new tab)`}
            className="border-brand-800/20 text-brand-800 flex shrink-0 cursor-pointer items-center justify-center rounded-full border-2 p-[5px]"
          >
            <SvgExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-700 px-2 text-white">Open in MRTT tool</TooltipContent>
      </Tooltip>
    </li>
  );
};

export default SitesItem;
