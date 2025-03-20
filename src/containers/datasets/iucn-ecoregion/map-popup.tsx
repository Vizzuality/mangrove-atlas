import cn from 'lib/classnames';

// import { INFO } from 'containers/datasets';
import { COLORS } from 'containers/datasets/iucn-ecoregion/constants';
import { useMangroveEcoregions } from 'containers/datasets/iucn-ecoregion/hooks';
import type { IUCNEcoregionPopUpInfo, Label } from 'containers/datasets/iucn-ecoregion/types';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'components/ui/collapsible';
// import { Dialog, DialogContent, DialogTrigger, DialogClose } from 'components/ui/dialog';
import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';

type Tags =
  | 'Historical (1750)'
  | 'Past 50 years (1970)'
  | 'Future (¹)'
  | 'Not evaluated'
  | 'Extent of occurrence'
  | 'Area of occupancy'
  | 'Threat locations <5'
  | 'Not evaluated';

const legendItems = [
  { color: '#F3AD6A', label: 'Vulnerable' },
  {
    color: '#B4DCAA',
    label: 'Least Concern',
  },
  {
    color: '#ECECEF',
    label: 'Not Evaluated',
  },
];

const FAKE_DATA_POP_UP = [
  {
    label: 'Reduction in geographic distribution',
    tags: ['Historical (1750)', 'Past 50 years (1970)', 'Future (¹)'],
    data: 'reduction_in_geographic_distribution',
  },
  {
    label: 'Restricted geographic distribution',
    tags: ['Extent of occurrence', 'Area of occupancy', 'Threat locations <5'],
    data: 'restricted_geographic_distribution',
  },
  {
    label: 'Environmental degradation',
    tags: ['Historical (1750)', 'Past 50 years (1970)', 'Future (¹)'],
    data: 'environmental_degradation',
  },
  {
    label: 'Distribution of biotic processes',
    tags: ['Historical (1750)', 'Past 50 years (1970)', 'Future (¹)'],
    data: 'distribution_of_biotic_processes',
  },
  {
    label: 'Quantitative risk analysis',
    tags: ['Not evaluated'],
    data: 'quantitative_risk_analysis',
  },
];

// const Info = INFO['mangrove_iucn_ecoregion'];

const IucnEcoregionPopup = ({ info }: { info: IUCNEcoregionPopUpInfo }) => {
  const { data } = useMangroveEcoregions();

  // Temp fix. TO -DO: Remove this when the data is updated
  const unitNameWithoutMangrove = info?.unit_name?.replace('Mangroves of', '').trim();
  const url = data?.reports?.find((d) => d.name.includes(unitNameWithoutMangrove))?.url;

  return (
    <Collapsible>
      <CollapsibleTrigger>
        <h3 className={WIDGET_SUBTITLE_STYLE}>IUCN ECOSYSTEM ASSESSMENT</h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex w-full min-w-[450px] flex-col space-y-2 border-none px-6 pb-6 shadow-none">
          <a
            className="w-full text-right text-xs text-brand-800 underline"
            target="_blank"
            rel="noopener noreferrer"
            href={url}
          >
            Province Descriptions
          </a>

          <div className="flex flex-col space-y-1">
            <ul className="flex space-x-2 text-sm">
              {legendItems.map(({ color, label }) => (
                <li key={label} className="flex items-center space-x-2">
                  {color && (
                    <div
                      className={cn({
                        'h-4 w-2 shrink-0 rounded-full font-normal': true,
                      })}
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {<span>{label}</span>}
                </li>
              ))}
            </ul>
            <p className="text-xs">(1) Or any 50 year period</p>
          </div>

          <div>
            <p className="text-sn font-sans font-semibold">{info?.unit_name}</p>
            <div className="max-h-[250px] overflow-y-auto pt-3 pr-2">
              {FAKE_DATA_POP_UP.map(
                ({ label, tags, data }: { label: Label; tags: Tags[]; data: string }) => (
                  <div key="label">
                    <p className="text-sm">{label}</p>
                    <ul className="flex space-x-3 py-4">
                      {tags.map((tag, index) => {
                        const infoKey = `${data}_${index + 1}`;
                        const colorKey = info[infoKey] as string;

                        // Check if colorKey is defined and has a value
                        const backgroundColor = colorKey
                          ? COLORS[colorKey.toLowerCase() as keyof typeof COLORS]
                          : 'ne';

                        return (
                          <div
                            key={`${label}-distribution_of_biotic_processes_${index + 1}`}
                            className="flex-1 rounded-3xl py-2 text-center text-xs font-normal"
                            style={{ backgroundColor }}
                          >
                            {tag}
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default IucnEcoregionPopup;
