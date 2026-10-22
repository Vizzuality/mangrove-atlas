import { trackEvent } from '@/lib/analytics/ga';

// import { INFO } from '@/containers/datasets';
import { COLORS } from '@/containers/datasets/iucn-ecoregion/constants';
import type { CategoryId } from '@/containers/datasets/iucn-ecoregion/constants';
import { useMangroveEcoregions } from '@/containers/datasets/iucn-ecoregion/hooks';
import IucnEcoregionPopupLegend from '@/containers/datasets/iucn-ecoregion/popup-legend';
import type { IUCNEcoregionPopUpInfo } from '@/containers/datasets/iucn-ecoregion/types';
import {
  POPUP_SECTION_CONTENT_STYLE,
  POPUP_SECTION_TRIGGER_STYLE,
} from '@/containers/map/pop-up/constants';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
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

const STATIC_DATA_POP_UP = [
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

  // Google Analytics tracking
  const handleAnalytics = () => {
    trackEvent('IUCN Ecoregion pop up - expand/collapse', {
      category: 'Map Popup iteration',
      action: 'Expand / collapse',
      label: 'IUCN Ecoregion pop up - expand/collapse',
    });
  };

  return (
    <Collapsible className="w-full sm:min-w-[467px]" onOpenChange={handleAnalytics}>
      <CollapsibleTrigger className={POPUP_SECTION_TRIGGER_STYLE} iconType="plus-minus">
        <h3 className={WIDGET_SUBTITLE_STYLE}>IUCN ECOSYSTEM RED LIST ASSESSMENT</h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className={POPUP_SECTION_CONTENT_STYLE}>
          <div className="pt-2.5">
            <p className="font-sans text-sm font-semibold">{info?.unit_name}</p>
            <a
              className="text-brand-800 w-full text-right text-sm underline"
              target="_blank"
              rel="noopener noreferrer"
              href={url}
            >
              Province Description
            </a>
            <div className="space-y-3.75 pt-3.75">
              {STATIC_DATA_POP_UP.map(
                ({ label, tags, data }: { label: string; tags: Tags[]; data: string }) => (
                  <div key={label}>
                    <p className="text-sm leading-5 font-light">{label}</p>
                    <ul className="flex gap-2.5 pt-3.75">
                      {tags.map((tag, index) => {
                        const infoKey = `${data}_${index + 1}`;
                        const colorKey = info[infoKey] as string | undefined;
                        const categoryId = colorKey?.toLowerCase() as CategoryId | undefined;
                        const backgroundColor = (categoryId && COLORS[categoryId]) || COLORS.ne;

                        return (
                          <li
                            key={`${label}-distribution_of_biotic_processes_${index + 1}`}
                            className="flex flex-1 items-center justify-center rounded-full px-2.5 py-1.25 text-center text-xs leading-[18px]"
                            style={{ backgroundColor }}
                          >
                            {tag}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>

          <IucnEcoregionPopupLegend />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default IucnEcoregionPopup;
