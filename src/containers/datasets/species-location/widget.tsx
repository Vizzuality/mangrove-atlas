import { useState, useCallback, useMemo } from 'react';

import * as RadioGroup from '@radix-ui/react-radio-group';
import { useRecoilValue } from 'recoil';

import { getWidgetActive } from 'containers/widget/selector';

import {
  Command,
  CommandItem,
  CommandGroup,
  CommandInput,
  CommandEmpty,
  CommandList,
} from 'components/command';
import RadioGroupItem from 'components/radio-group/radio-group-item';
import type { RadioOption } from 'components/radio-group/types';

import { useMangroveSpeciesLocation } from './hooks';
import type { DataResponse } from './types';

const SpeciesLocation = () => {
  const [specieSelected, setSpecie] = useState<DataResponse['data'][number]>();
  const {
    data: species,
    isLoading,
    isFetched,
  } = useMangroveSpeciesLocation({
    select: ({ data }) => data,
  });
  const isWidgetActive = useRecoilValue(getWidgetActive('mangrove_species_location'));

  const specieOptions = useMemo(
    () =>
      species.map(({ scientific_name }) => ({
        label: scientific_name,
        value: scientific_name,
      })),
    [species]
  );

  const onSelectSpecie = useCallback(
    (specieName: RadioOption['value']) => {
      const specie = species.find(({ scientific_name }) => scientific_name === specieName);
      if (specie) setSpecie(specie);
    },
    [species]
  );

  const totalLocations = useMemo(() => specieSelected?.location_ids?.length || 0, [specieSelected]);

  return (
    <>
      <div>
        {isLoading && <p>Loading...</p>}
        {!isLoading && isFetched && (
          <>
            {specieSelected ? (
              <p className="pb-10 text-lg font-light text-black/85">
                <span className="font-bold">{specieSelected.scientific_name}</span> is located in{' '}
                <span className="font-bold">{totalLocations}</span> countries.
              </p>
            ) : (
              <p className="pb-10 text-lg font-light text-black/85">
                Select one species from the list below to see where it&apos;s located.
              </p>
            )}
            {isWidgetActive && (
              <div className="mb-8 flex items-center space-x-2">
                <svg
                  width="6"
                  height="12"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rounded-lg"
                >
                  <rect width="6" height="12" className="fill-brand-400" />
                </svg>
                <span className="text-sm font-bold text-black/85">
                  Countries where the specie is located
                </span>
              </div>
            )}
            <div className="h-1 border-b border-dashed border-brand-400 border-opacity-50" />

            <Command className="w-full">
              <div className="w-full pt-8">
                <CommandInput
                  placeholder="Search species..."
                  className="w-full rounded-[20px] border-brand-400 text-sm placeholder:text-sm placeholder:text-black/85"
                />
              </div>
              <CommandList className="relative mt-2">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup className="before:content after:content relative before:pointer-events-none before:absolute before:top-0 before:left-0 before:right-4 before:z-10 before:h-5 before:w-full before:bg-gradient-to-b before:from-white after:pointer-events-none after:absolute after:bottom-3 after:left-0 after:h-5 after:w-full after:bg-gradient-to-t after:from-white">
                  <RadioGroup.Root
                    aria-label="Species"
                    className="space-y mb-2 flex h-full max-h-[170px] flex-col overflow-y-auto py-2"
                    onValueChange={onSelectSpecie}
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
    </>
  );
};

export default SpeciesLocation;
