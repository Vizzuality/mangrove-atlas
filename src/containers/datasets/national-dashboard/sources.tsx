import chroma from 'chroma-js';

import { COLORS } from './constants';
import IndicatorSource from './indicator-layers';
import type { IndicatorDataItem } from './types';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Sources = ({ data, iso }: { data: IndicatorDataItem[]; iso: string }) => {
  const sourceColorMap = new Map<string, number>();
  data?.forEach(({ sources }) => {
    sources?.forEach(({ source }) => {
      if (!sourceColorMap.has(source)) {
        sourceColorMap.set(source, sourceColorMap.size);
      }
    });
  });

  const palette = chroma
    .scale(COLORS)
    .colors(sourceColorMap.size > COLORS.length ? sourceColorMap.size : COLORS.length);

  return (
    <section className="space-y-6.25 py-[25px]">
      {data?.map(({ indicator, sources }) => (
        /*
         * ARIA table roles rather than <table> markup: the visual layout is a
         * CSS grid whose cells are rendered by three separate components, and
         * real table elements would force either display:contents on the cells
         * (which drops them from the accessibility tree in some browsers) or a
         * layout rewrite. The roles give screen readers row/column association
         * with no rendering change at all.
         *
         * The column labels were <h5> elements — they are not headings, and
         * they polluted the page outline with three entries per indicator.
         */
        <div key={indicator} role="table" aria-label={`${indicator} sources`}>
          {/* Headers stay for screen readers; the design shows the rows without them. */}
          <div role="row" className="sr-only">
            <span role="columnheader">Source</span>
            <span role="columnheader">Year</span>
            <span role="columnheader">Extent</span>
            <span role="columnheader">Layer controls</span>
          </div>
          {sources.map(({ source, years, unit, data_source }) => {
            const colorIndex = sourceColorMap.get(source) ?? 0;
            const color = palette[colorIndex % palette.length];
            const layerKey = slugify(`${indicator}__${source}`);
            return (
              <IndicatorSource
                id={`mangrove_national_dashboard_layer_${iso}`}
                locationIso={iso}
                layerIndex={colorIndex}
                layerKey={layerKey}
                key={layerKey}
                indicator={indicator}
                source={source}
                // Deduped: the year selector keys its options by the year, and a
                // repeated year would also turn a single-year source into a dropdown.
                years={years ? [...new Set(years)] : years}
                unit={unit}
                data_source={data_source}
                color={color}
                className="text-2lg py-3 leading-7.5 font-light"
              />
            );
          })}
        </div>
      ))}
    </section>
  );
};

export default Sources;
