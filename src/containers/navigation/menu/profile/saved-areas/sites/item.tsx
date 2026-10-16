'use client';

import { useCallback, useMemo } from 'react';

import Link from 'next/link';

import { analysisAtom } from '@/store/analysis';
import { customAreaNameAtom, drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

import { Close as DialogPrimitiveClose } from '@radix-ui/react-dialog';
import type { Geometry } from 'geojson';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { useLocationNavigation } from 'hooks/location-navigation';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import SvgExternalLink from '@/svgs/ui/external_link';

import { siteGeometryToBBox, siteGeometryToFeatureCollection } from './utils';

export type GeometryStatus = 'loading' | 'error' | 'ready';

type Props = {
  id: number;
  name: string;
  /** Null when `/widgets/sites` has no polygon for this site (not drawn yet in MRTT). */
  geometry: Geometry | null;
  /** State of the geometry lookup, so "still loading" is not shown as "no polygon". */
  geometryStatus?: GeometryStatus;
};

const NO_GEOMETRY_MESSAGE: Record<GeometryStatus, string> = {
  loading: 'Loading site boundaries…',
  error: 'Site boundaries could not be loaded. Try again later.',
  ready: 'This site has no area drawn in the MRTT yet.',
};

const SitesItem = ({ name, id, geometry, geometryStatus = 'ready' }: Props) => {
  const { navigate } = useLocationNavigation();

  const setDrawingUploadToolState = useSetAtom(drawingUploadToolAtom);
  const setCustomAreaName = useSetAtom(customAreaNameAtom);
  const resetDrawingToolState = useResetAtom(drawingToolAtom);
  const setAnalysisState = useSetAtom(analysisAtom);

  const featureCollection = useMemo(
    () => (geometry ? siteGeometryToFeatureCollection(geometry) : null),
    [geometry]
  );
  const bounds = useMemo(() => (geometry ? siteGeometryToBBox(geometry) : null), [geometry]);

  const handleSiteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // No preventDefault: the button is wrapped in Radix `Dialog.Close`, which skips
      // closing the host dialog when the click event is default-prevented.
      e.stopPropagation();
      if (!featureCollection) return;

      // Same pipeline as a saved custom area: the polygon goes through the upload-tool
      // state so mapbox-gl-draw renders the boundary and the widgets reroute to the
      // analysis API for this site.
      resetDrawingToolState();
      setDrawingUploadToolState((prev) => ({
        ...prev,
        uploadedGeojson: featureCollection,
        customGeojson: null,
      }));
      // Still a custom-area route; only the title shows the site name instead of "Custom Area".
      setCustomAreaName({ name, geojson: featureCollection });
      setAnalysisState((prev) => ({ ...prev, enabled: true }));
      navigate({ type: 'custom-area' }, bounds);
    },
    [
      featureCollection,
      bounds,
      name,
      navigate,
      resetDrawingToolState,
      setDrawingUploadToolState,
      setCustomAreaName,
      setAnalysisState,
    ]
  );

  const mrttHref = `${process.env.NEXT_PUBLIC_MRTT_SITE}/sites/${id}/overview`;

  return (
    <li className="flex items-center justify-between gap-3">
      {geometry ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Closes whichever dialog hosts the list (Saved areas or My profile) so the
                map and the analysis widgets are visible right after selecting a site. */}
            <DialogPrimitiveClose asChild>
              <button
                type="button"
                aria-label={`Analyse site ${name}`}
                className="focus-visible:ring-brand-500 text-left underline-offset-2 first-letter:uppercase focus-visible:ring-2 focus-visible:outline-none"
                onClick={handleSiteClick}
              >
                {name}
              </button>
            </DialogPrimitiveClose>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-700 px-2 text-white">
            Click to view this site on the map and analyse it.
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="cursor-default text-black/60 first-letter:uppercase"
              aria-busy={geometryStatus === 'loading'}
            >
              {name}
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-700 px-2 text-white">
            {NO_GEOMETRY_MESSAGE[geometryStatus]}
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={mrttHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${name} in the MRTT (opens in new tab)`}
            className="border-brand-800/20 text-brand-800 flex shrink-0 items-center justify-center rounded-full border-2 p-[5px]"
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
