import chroma from 'chroma-js';

import { COLORS } from './constants';
import IndicatorSource from './indicator-layers';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Sources = ({ data, iso }) => {
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
    <section className="space-y-6.25">
      {data?.map(({ indicator, sources }) => (
        <div key={indicator}>
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
                years={years}
                unit={unit}
                data_source={data_source}
                color={color}
              />
            );
          })}
        </div>
      ))}
    </section>
  );
};

export default Sources;
