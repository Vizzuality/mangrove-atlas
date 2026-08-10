import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { SpeciesLocationState } from '@/store/widgets/species-location';

import type { PrimitiveAtom } from 'jotai';
import { useAtom } from 'jotai';
import { CgRadioCheck } from 'react-icons/cg';
import type { IconBaseProps } from 'react-icons/lib';

import { useSyncLocation } from 'hooks/use-sync-location';

import { useLocation } from '@/containers/datasets/locations/hooks';
import { useIsLayerActive } from '@/containers/widget/selector';
import NoData from '@/containers/widgets/no-data';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import Loading from '@/components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from '@/styles/widgets';

import { useMangroveSpeciesLocation } from './hooks';
import type { DataResponse, Specie } from './types';

const RadioCheckIcon = CgRadioCheck as unknown as (p: IconBaseProps) => JSX.Element;

const SpeciesLocation = () => {
  const { type: locationType, id } = useSyncLocation();
  const {
    data: { name: location },
  } = useLocation(id, locationType);
  const [specieSelected, setSpecie] = useAtom(
    SpeciesLocationState as unknown as PrimitiveAtom<DataResponse['data'][number] | null>
  );

  const {
    data: species,
    isLoading,
    isFetched,
    isPlaceholderData,
  } = useMangroveSpeciesLocation<Specie[]>({
    select: ({ data }: DataResponse) => data,
  });
  const isLayerActive = useIsLayerActive('mangrove_species_location');

  const specieOptions = useMemo(
    () =>
      species?.map(({ scientific_name }) => ({
        label: scientific_name,
        value: scientific_name,
      })),
    [species]
  );

  const onSelectSpecies = useCallback(
    (specieName: string) => {
      const specie = species.find(({ scientific_name }) => scientific_name === specieName);
      if (specie) setSpecie(specie);
      // Google Analytics tracking
      trackEvent('Widget iteration - species location - select specie', {
        category: 'Widget iteration',
        action: 'Select',
        label: `Widget iteration - species location - select specie ${specie}`,
        value: specie,
      });
    },
    [species, setSpecie]
  );

  const totalLocations = useMemo(() => specieSelected?.location_ids?.length || 0, [specieSelected]);

  // Show the top/bottom fade overlays only when there is scrollable content in that direction.
  const listRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ top: false, bottom: false });

  const updateFade = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setFade({
      top: scrollTop > 0,
      bottom: Math.ceil(scrollTop + clientHeight) < scrollHeight,
    });
  }, []);

  useEffect(() => {
    updateFade();
  }, [updateFade, specieOptions]);

  if (isFetched && !species?.length) return <NoData />;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <>
          {specieSelected ? (
            <p className={`${WIDGET_SENTENCE_STYLE}, pb-4`}>
              <span className="font-bold">{specieSelected.scientific_name}</span> is located in{' '}
              <span className="font-bold">{totalLocations}</span> countries.
            </p>
          ) : (
            <p className="pb-4 text-lg font-light text-black/85">
              Select one species from the list below to see where it&apos;s located.{' '}
            </p>
          )}

          {isLayerActive && specieSelected && (
            <div className="mb-8 flex items-center space-x-2">
              <div className="border-brand-800 my-0.5 mr-2.5 h-4 w-2 rounded-md border bg-[url(/images/species-location/small-pattern.svg)] bg-center text-sm" />
              <span className="text-sm font-bold text-black/85">
                Countries where the species is located
              </span>
            </div>
          )}

          <div className="border-brand-400 border-opacity-50 h-1 border-b border-dashed" />
          {location !== 'worldwide' && (
            <p>
              Species list is filtered by <span className="font-bold">{location}</span>
            </p>
          )}
          <Command className="w-full">
            <div className="w-full pt-6">
              <CommandInput
                placeholder="Search species..."
                onValueChange={() => requestAnimationFrame(updateFade)}
                className="border-brand-400 w-full rounded-3xl text-sm placeholder:text-sm placeholder:text-black/85"
              />
            </div>
            <CommandList className="relative mt-2" aria-label="Species">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup
                ref={listRef}
                onScroll={updateFade}
                className={cn(
                  'space-y relative mb-2 flex h-full max-h-[170px] flex-col overflow-y-auto py-2',
                  {
                    'before:content before:pointer-events-none before:absolute before:top-0 before:right-4 before:left-0 before:z-10 before:h-5 before:w-full before:bg-linear-to-b before:from-white':
                      fade.top,
                    'after:content after:pointer-events-none after:absolute after:bottom-3 after:left-0 after:h-5 after:w-full after:bg-linear-to-t after:from-white':
                      fade.bottom,
                  }
                )}
              >
                {specieOptions.map((specie) => {
                  const isSelected = specieSelected?.scientific_name === specie.value;
                  return (
                    <CommandItem
                      key={specie.value}
                      value={specie.value}
                      onSelect={() => onSelectSpecies(specie.value)}
                      className="flex cursor-pointer items-center space-x-4 py-1"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-black/85',
                          { 'border-brand-800 border-4': isSelected }
                        )}
                      >
                        {isSelected && (
                          <RadioCheckIcon
                            className="text-brand-800 h-2.5 w-2.5"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="text-brand-800 text-sm leading-none font-semibold">
                        {specie.label}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </>
      )}
    </div>
  );
};

export default SpeciesLocation;
