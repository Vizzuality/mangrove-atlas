'use client';

import { useCallback, useMemo } from 'react';

import Link from 'next/link';

import { analysisAtom } from '@/store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

import type { Geometry } from 'geojson';
import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import { useLocationNavigation } from 'hooks/location-navigation';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import SvgExternalLink from '@/svgs/ui/external_link';

import { siteGeometryToBBox, siteGeometryToFeatureCollection } from './utils';

type Props = {
  id: number;
  name: string;
  /** Null when `/widgets/sites` has no polygon for this site (not drawn yet in MRTT). */
  geometry: Geometry | null;
};

const SitesItem = ({ name, id, geometry }: Props) => {
  const { navigate } = useLocationNavigation();

  const setDrawingUploadToolState = useSetAtom(drawingUploadToolAtom);
  const resetDrawingToolState = useResetAtom(drawingToolAtom);
  const setAnalysisState = useSetAtom(analysisAtom);

  const featureCollection = useMemo(
    () => (geometry ? siteGeometryToFeatureCollection(geometry) : null),
    [geometry]
  );
  const bounds = useMemo(() => (geometry ? siteGeometryToBBox(geometry) : null), [geometry]);

  const handleSiteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
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
      setAnalysisState((prev) => ({ ...prev, enabled: true }));
      navigate({ type: 'custom-area' }, bounds);
    },
    [
      featureCollection,
      bounds,
      navigate,
      resetDrawingToolState,
      setDrawingUploadToolState,
      setAnalysisState,
    ]
  );

  const mrttHref = `${process.env.NEXT_PUBLIC_MRTT_SITE}/sites/${id}/overview`;

  return (
    <li className="flex items-center justify-between gap-3">
      {geometry ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`Analyse site ${name}`}
              className="focus-visible:ring-brand-500 text-left underline-offset-2 first-letter:uppercase focus-visible:ring-2 focus-visible:outline-none"
              onClick={handleSiteClick}
            >
              {name}
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-700 px-2 text-white">
            Click to view this site on the map and analyse it.
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default text-black/60 first-letter:uppercase">{name}</span>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-700 px-2 text-white">
            This site has no area drawn in the MRTT yet.
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
