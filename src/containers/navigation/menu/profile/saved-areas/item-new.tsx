'use client';

import { useCallback, useState } from 'react';

import cn from '@/lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

import { useAtomValue } from 'jotai';
import { LuPlus } from 'react-icons/lu';

import { LocationTypes } from '@/containers/datasets/locations/types';
import {
  CustomGeometry,
  useCreateUserLocation,
} from '@/containers/datasets/locations/user-locations';

import { Input } from '@/components/ui/input';

const LuPlusIcon = LuPlus as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

// Planar shoelace area of a linear ring — only used to compare relative polygon sizes,
// so an unprojected approximation is fine.
const ringArea = (ring: GeoJSON.Position[]): number => {
  let area = 0;
  for (let i = 0, n = ring.length - 1; i < n; i++) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return Math.abs(area / 2);
};

// Reduce a geometry to Polygon coordinates the backend accepts. Polygon passes through;
// MultiPolygon is unwrapped when single-part, otherwise the largest part is kept.
const toPolygonCoordinates = (
  geom: GeoJSON.Geometry | undefined
): GeoJSON.Polygon['coordinates'] | null => {
  if (!geom) return null;
  if (geom.type === 'Polygon') return geom.coordinates?.length ? geom.coordinates : null;
  if (geom.type === 'MultiPolygon') {
    const polygons = geom.coordinates;
    if (!polygons?.length) return null;
    if (polygons.length === 1) return polygons[0];
    return polygons.reduce((largest, polygon) =>
      ringArea(polygon[0]) > ringArea(largest[0]) ? polygon : largest
    );
  }
  return null;
};

type Props = {
  name: string;
  systemLocationId?: number; // only for system routes
  locationType?: LocationTypes; // includes 'custom-area'
  disabled?: boolean;
};

const LocationItemNew = ({ name, systemLocationId, locationType, disabled }: Props) => {
  const [newName, setNewName] = useState(name);

  // Resync the input when the route-provided name changes, without an effect
  // (adjust state during render — see https://react.dev/learn/you-might-not-need-an-effect).
  const [prevName, setPrevName] = useState(name);
  if (name !== prevName) {
    setPrevName(name);
    setNewName(name);
  }

  const createUserLocationMutation = useCreateUserLocation();

  const { customGeojson } = useAtomValue(drawingToolAtom);
  const { uploadedGeojson } = useAtomValue(drawingUploadToolAtom);

  const buildCustomGeometry = useCallback((): CustomGeometry | null => {
    const drawn = customGeojson?.features?.[0]?.geometry;
    const uploaded = uploadedGeojson?.features?.[0]?.geometry;

    const geom = drawn ?? uploaded;
    // Drawn areas are always a single Polygon. Uploaded shapefiles/geopackages commonly
    // convert to MultiPolygon, which the create endpoint rejects (500). Reduce those to a
    // single Polygon (unwrap when there is one part; otherwise keep the largest part) so
    // uploaded areas can be saved.
    const coordinates = toPolygonCoordinates(geom);
    if (!coordinates) return null;

    return {
      description: drawn ? 'Custom drawn area' : 'Uploaded area',
      type: 'Polygon',
      coordinates,
    };
  }, [customGeojson, uploadedGeojson]);

  const handleNewName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.currentTarget.value);
  }, []);

  const handleClickSaveArea = useCallback(async () => {
    try {
      const finalName = newName.trim() || name;
      if (!finalName) return;

      // Create custom area
      if (locationType === 'custom-area') {
        const custom_geometry = buildCustomGeometry();
        if (!custom_geometry) {
          console.warn('No custom geometry available to save.');
          return;
        }

        await createUserLocationMutation.createUserLocation({
          name: finalName,
          location_type: 'custom',
          custom_geometry,
        });
        return;
      }

      // Create system area
      if (typeof systemLocationId !== 'number') {
        console.warn('No systemLocationId available to save.');
        return;
      }

      await createUserLocationMutation.createUserLocation({
        name: finalName,
        location_type: 'system',
        location_id: systemLocationId,
      });
    } catch (error) {
      console.error('Error saving location', error);
    }
  }, [
    newName,
    name,
    locationType,
    systemLocationId,
    buildCustomGeometry,
    createUserLocationMutation,
  ]);

  const isDisabled = Boolean(disabled || createUserLocationMutation.isLoading);

  return (
    <li className="flex items-center justify-between gap-3">
      {locationType !== 'custom-area' ? (
        <span className="text-brand-800 font-bold first-letter:uppercase">{name}</span>
      ) : (
        <Input
          type="text"
          aria-label="Name for new area"
          value={newName}
          onChange={handleNewName}
        />
      )}

      <div className="flex space-x-2">
        <button
          type="button"
          aria-label={`Add location ${name}`}
          disabled={isDisabled}
          onClick={handleClickSaveArea}
          className={cn(
            'bg-brand-800 border-brand-800 flex shrink-0 items-center justify-center rounded-full border-2 p-1 text-white',
            isDisabled && 'cursor-not-allowed opacity-60'
          )}
        >
          <LuPlusIcon className="h-5 w-5 stroke-2" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

export default LocationItemNew;
