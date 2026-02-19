'use client';

import { useCallback } from 'react';
import { LuX } from 'react-icons/lu';

import { useDeleteUserLocation } from '@/containers/datasets/locations/user-locations';
import cn from '@/lib/classnames';

const LuXIcon = LuX as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

type Props = { name: string; id: number };

const LocationItem = ({ name, id }: Props) => {
  const deleteUserLocationArea = useDeleteUserLocation();
  const isDeleting = deleteUserLocationArea.isLoading;

  const handleClick = useCallback(async () => {
    try {
      await deleteUserLocationArea.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting location', error);
    }
  }, [deleteUserLocationArea, id]);

  return (
    <li className="flex items-center justify-between gap-3">
      <span
        className={cn('first-letter:uppercase', name === 'worldwide' && 'text-brand-800 font-bold')}
      >
        {name}
      </span>

      <button
        type="button"
        aria-label={`Delete location ${name}`}
        disabled={isDeleting}
        onClick={handleClick}
        className={cn(
          'border-brand/80 text-brand-800 flex shrink-0 items-center justify-center rounded-full border-2 p-1',
          isDeleting && 'cursor-not-allowed opacity-60'
        )}
      >
        <LuXIcon className="h-5 w-5 cursor-pointer stroke-2" />
      </button>
    </li>
  );
};

export default LocationItem;
