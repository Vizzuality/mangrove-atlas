import { useCallback, useMemo } from 'react';

import { useRouter } from 'next/router';

import * as RadioGroup from '@radix-ui/react-radio-group';
import { useRecoilValue, useRecoilState } from 'recoil';

import {
  Command,
  CommandItem,
  CommandGroup,
  CommandInput,
  CommandEmpty,
  CommandList,
} from 'components/ui/command';
import Loading from 'components/ui/loading';
import RadioGroupItem from 'components/ui/radio-group/radio-group-item';
import type { RadioOption } from 'components/ui/radio-group/types';
import { useLocation } from 'containers/datasets/locations/hooks';
import { LocationTypes } from 'containers/datasets/locations/types';
import { getLayerActive } from 'containers/widget/selector';
import NoData from 'containers/widgets/no-data';
import { SpeciesLocationState } from 'store/widgets/species-location';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import { useMangroveSpeciesLocation } from './hooks';
import type { DataResponse } from './types';

const SpeciesLocation = () => {
  const {
    query: { params: queryParams },
  } = useRouter();
  const locationType = queryParams?.[0] as LocationTypes;
  const id = queryParams?.[1];
  const {
    data: { name: location },
  } = useLocation(id, locationType);
  const [specieSelected, setSpecie] =
    useRecoilState<DataResponse['data'][number]>(SpeciesLocationState);

  const {
    data: species,
    isLoading,
    isFetched,
    isPlaceholderData,
  } = useMangroveSpeciesLocation({
    select: ({ data }) => data,
  });
  const isLayerActive = useRecoilValue(getLayerActive('mangrove_species_location'));

  const specieOptions = useMemo(
    () =>
      species.map(({ scientific_name }) => ({
        label: scientific_name,
        value: scientific_name,
      })),
    [species],
  );

  const onSelectSpecies = useCallback(
    (specieName: RadioOption['value']) => {
      const specie = species.find(({ scientific_name }) => scientific_name === specieName);
      if (specie) setSpecie(specie);
    },
    [species, setSpecie],
  );

  const totalLocations = useMemo(() => specieSelected?.location_ids?.length || 0, [specieSelected]);

  if (isFetched && !species.length) return <NoData />;

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
              <div className="my-0.5 mr-2.5 h-4 w-2 rounded-md border border-brand-800 bg-[url('/images/species-location/small-pattern.svg')] bg-center text-sm" />
              <span className="text-sm font-bold text-black/85">
                Countries where the species is located
              </span>
            </div>
          )}

          <div className="h-1 border-b border-dashed border-brand-400 border-opacity-50" />
          {location !== 'worldwide' && (
            <p>
              Species list is filtered by <span className="font-bold">{location}</span>
            </p>
          )}
          <Command className="w-full">
            <div className="w-full pt-6">
              <CommandInput
                placeholder="Search species..."
                className="w-full rounded-3xl border-brand-400 text-sm placeholder:text-sm placeholder:text-black/85"
              />
            </div>
            <CommandList className="relative mt-2">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="before:content after:content relative before:pointer-events-none before:absolute before:top-0 before:left-0 before:right-4 before:z-10 before:h-5 before:w-full before:bg-gradient-to-b before:from-white after:pointer-events-none after:absolute after:bottom-3 after:left-0 after:h-5 after:w-full after:bg-gradient-to-t after:from-white">
                <RadioGroup.Root
                  aria-label="Species"
                  className="space-y mb-2 flex h-full max-h-[170px] flex-col overflow-y-auto py-2"
                  onValueChange={onSelectSpecies}
                >
                  {specieOptions.map((specie) => (
                    <CommandItem key={specie.value}>
                      <div className="flex items-center">
                        <RadioGroupItem option={specie} />
                      </div>
                    </CommandItem>
                  ))}
                </RadioGroup.Root>
              </CommandGroup>
            </CommandList>
          </Command>
        </>
      )}
    </div>
  );
};

export default SpeciesLocation;
