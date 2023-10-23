import cn from 'lib/classnames';

import { COLORS } from 'containers/datasets/iucn-ecoregion/constants';
import type { IUCNEcoregionPopUpInfo } from 'containers/datasets/iucn-ecoregion/types';

import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';
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

const IucnEcoregionPopup = ({ info }: { info: IUCNEcoregionPopUpInfo }) => (
  <div
    className={cn({
      [WIDGET_CARD_WRAPPER_STYLE]: true,
      'w-full min-w-[500px] space-x-2 rounded-2xl bg-white p-5 pt-0': true,
    })}
  >
    <header className="flex w-full items-center justify-between">
      <h2 className="cursor-pointer whitespace-nowrap py-5 text-xs font-bold uppercase -tracking-tighter text-black/85">
        ECOSYSTEM ASSESMENT
      </h2>
      {/* <a
        href=""
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap text-sm text-brand-800 underline"
      >
        Province Description (PDF)
      </a> */}
    </header>
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
    <p>{info?.unit_name}</p>
    <div className="max-h-[250px] overflow-y-auto pt-3">
      {FAKE_DATA_POP_UP.map(({ label, tags, data }) => (
        <div key="label">
          <p className="text-sm">{label}</p>
          <ul className="flex space-x-3 py-4">
            {tags.map((tag, index) => (
              <div
                key={`${label}-distribution_of_biotic_processes_${index + 1}`}
                className="flex-1 rounded-3xl py-2 text-center text-xs font-normal"
                style={{
                  backgroundColor: COLORS[info[`${data}_${index + 1}`].toLowerCase()],
                }}
              >
                {tag}
              </div>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default IucnEcoregionPopup;
