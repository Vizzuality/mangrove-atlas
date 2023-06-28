import flatten from 'lodash-es/flatten';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SUBTITLE_STYLE } from 'styles/widgets';

import { COLORS } from './constants';
import { useNationalDashboard } from './hooks';
import IndicatorSources from './indicator-sources';
import OtherResources from './other-resources';

const NationalDashboard = () => {
  const { data, isLoading, isFetching, isFetched } = useNationalDashboard();
  if (!data?.data.length) return null;

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isLoading && !isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && !isFetching && data && (
        <div className="space-y-4">
          <section>
            {data?.data?.map(({ indicator, sources }, index) => (
              <div key={indicator}>
                <h3 className={WIDGET_SUBTITLE_STYLE}>{indicator}</h3>
                {sources.map(({ source, years, unit, data_source }) => {
                  const dataSource = data_source.filter(
                    (d) => d.year === years[years.length - 1]
                  )[0];
                  const color = COLORS[index];

                  return (
                    <IndicatorSources
                      key={source}
                      source={source}
                      years={years}
                      unit={unit}
                      dataSource={dataSource}
                      color={color}
                    />
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
              <section>
                <h3 className={WIDGET_SUBTITLE_STYLE}>OTHER RESOURCES</h3>
                {data?.metadata?.other_resourcess.map(({ name, description, link }) => (
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
