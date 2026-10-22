import { LEGEND_ITEMS } from '@/containers/datasets/iucn-ecoregion/constants';
import type { LegendItem } from '@/containers/datasets/iucn-ecoregion/constants';

type IucnEcoregionPopupLegendProps = {
  items?: LegendItem[];
};

const IucnEcoregionPopupLegend = ({ items = LEGEND_ITEMS }: IucnEcoregionPopupLegendProps) => (
  <div className="flex flex-col space-y-3.75 pt-2.5">
    <ul className="flex flex-wrap gap-x-3.75 gap-y-2.5 text-sm leading-5">
      {items.map(({ color, label }) => (
        <li key={label} className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="h-4 w-2 shrink-0 rounded"
            style={{ backgroundColor: color }}
          />
          <span>{label}</span>
        </li>
      ))}
    </ul>
    <p className="text-xs leading-[18px]">(1) Or any 50 year period</p>
  </div>
);

export default IucnEcoregionPopupLegend;
