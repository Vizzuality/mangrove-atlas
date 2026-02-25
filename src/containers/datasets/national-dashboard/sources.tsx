import { useState } from 'react';

import chroma from 'chroma-js';

import flatten from 'lodash-es/flatten';

import { COLORS } from './constants';
import IndicatorSource from './indicator-layers';

const Sources = ({ data, iso }) => {
  const [yearSelected, setYearSelected] = useState<number>(data?.sources?.years?.[0] || null);

  const sources = flatten(
    data?.map(({ sources }) =>
      flatten(
        sources.map(({ data_source }) =>
          data_source.map(({ layer_link }, index) =>
            index === 0 ? `mapbox://${layer_link}` : layer_link
          )
        )
      )
    )
  );

  const colorsScale = chroma
    .scale(COLORS)
    .colors(sources.length > COLORS.length ? sources.length : COLORS.length);
  const years = data?.[0]?.sources[0]?.years;
  const currentYear = yearSelected || years?.[years?.length - 1];

  return (
    <section className="space-y-[25px]">
      {data?.map(({ indicator, sources }, index) => (
        <div key={indicator}>
          {/* <h3 className={WIDGET_SUBTITLE_STYLE}>{indicator}</h3> */}
          {sources.map(({ source, years, unit, data_source }) => {
            const dataSource = data_source.find((d) => d.year === currentYear);
            const color = colorsScale.filter((c, i) => i === index);
            return (
              <IndicatorSource
                id={`mangrove_national_dashboard_layer_${dataSource.source_layer}`}
                locationIso={iso}
                layerIndex={index}
                key={source}
                source={source}
                years={years}
                unit={unit}
                dataSource={dataSource}
                color={color}
                yearSelected={currentYear}
                setYearSelected={setYearSelected}
              />
            );
          })}
        </div>
      ))}
    </section>
  );
};

export default Sources;
