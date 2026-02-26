'use client';

import { useCallback, useEffect, useState } from 'react';

import cn from '@/lib/classnames';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';

import { LuPlus } from 'react-icons/lu';
import { useRecoilValue } from 'recoil';

import { LocationTypes } from '@/containers/datasets/locations/types';
import {
  CustomGeometry,
  useCreateUserLocation,
} from '@/containers/datasets/locations/user-locations';

import { Input } from '@/components/ui/input';

const LuPlusIcon = LuPlus as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

type Props = {
  name: string;
  systemLocationId?: number; // only for system routes
  locationType?: LocationTypes; // includes 'custom-area'
  disabled?: boolean;
};

const LocationItemNew = ({ name, systemLocationId, locationType, disabled }: Props) => {
  const [newName, setNewName] = useState(name);

  // If route changes name, resync
  useEffect(() => {
    setNewName(name);
  }, [name]);

  const createUserLocationMutation = useCreateUserLocation();

  const { customGeojson } = useRecoilValue(drawingToolAtom);
  const { uploadedGeojson } = useRecoilValue(drawingUploadToolAtom);

  const buildCustomGeometry = useCallback((): CustomGeometry | null => {
    const drawn = customGeojson?.features?.[0]?.geometry;
    const uploaded = uploadedGeojson?.features?.[0]?.geometry;

    const geom = drawn ?? uploaded;
    if (!geom || geom.type !== 'Polygon' || !('coordinates' in geom) || !geom.coordinates)
      return null;

    return {
      description: drawn ? 'Custom drawn area' : 'Uploaded area',
      type: 'Polygon',
      coordinates: (geom as GeoJSON.Polygon).coordinates,
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
        <Input type="text" value={newName} onChange={handleNewName} />
      )}

      <div className="flex space-x-2">
        <button
          type="button"
          aria-label={`Add location ${name}`}
          disabled={isDisabled}
          onClick={handleClickSaveArea}
          className={cn(
            'border-brand/80 bg-brand-800 border-brand-800 flex shrink-0 items-center justify-center rounded-full border-2 p-1 text-white',
            isDisabled && 'cursor-not-allowed opacity-60'
          )}
        >
          <LuPlusIcon className="h-5 w-5 stroke-2" />
        </button>
      </div>
    </li>
  );
};

export default LocationItemNew;
