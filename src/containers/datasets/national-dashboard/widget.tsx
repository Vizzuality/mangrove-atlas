import { useState } from 'react';

import flatten from 'lodash-es/flatten';

import cn from 'lib/classnames';

import chroma from 'chroma-js';

import { useLocation } from 'containers/datasets/locations/hooks';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SUBTITLE_STYLE } from 'styles/widgets';

import { COLORS } from './constants';
import { useNationalDashboard } from './hooks';
import IndicatorSource from './indicator-source';
import OtherResources from './other-resources';

const NationalDashboard = () => {
  const { data, isLoading, isFetching, isFetched } = useNationalDashboard();
  const [yearSelected, setYearSelected] = useState<number>(data?.data?.sources?.years?.[0] || null);
  if (!data?.data.length) return null;
  const sources = flatten(
    data?.data?.map(({ sources }) =>
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
  const years = data?.data?.[0]?.sources[0]?.years;
  const currentYear = yearSelected || years?.[years?.length - 1];
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isLoading && !isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && !isFetching && data && (
        <div className="space-y-2">
          <section>
            {data?.data?.map(({ indicator, sources }, index) => (
              <div key={indicator}>
                {/* <h3 className={WIDGET_SUBTITLE_STYLE}>{indicator}</h3> */}
                {sources.map(({ source, years, unit, data_source }) => {
                  const dataSource = data_source.find((d) => d.year === currentYear);
                  const color = colorsScale.filter((c, i) => i === index);
                  return (
                    <>
                      <div className="grid grid-cols-4 text-sm font-normal">
                        <h5>Source</h5>
                        <h5 className="ml-2">Year</h5>
                        <h5 className="ml-2">Extent</h5>
                      </div>

                      <IndicatorSource
                        id={`mangrove_national_dashboard_layer_${dataSource.source_layer}`}
                        locationIso={data.locationIso}
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
                    </>
                  );
                })}
              </div>
            ))}
          </section>
          {!!data?.metadata?.other_resources.length && (
              <div className="relative py-4">
                <div className="absolute top-1/2 -left-10 -right-10 h-0.5 bg-brand-800 bg-opacity-30" />
              </div>
            ) && (
              <section className="space-y-2">
                <h3 className={cn({ [WIDGET_SUBTITLE_STYLE]: true, 'py-2': true })}>
                  OTHER RESOURCES
                </h3>
                {data?.metadata?.other_resources.map(({ name, description, link }) => (
                  <OtherResources key={link} name={name} description={description} link={link} />
                ))}
              </section>
            )}
        </div>
      )}
    </div>
  );
};

export default NationalDashboard;
