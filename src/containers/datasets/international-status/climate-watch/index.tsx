import Link from 'next/link';

import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SUBTITLE_STYLE } from 'styles/widgets';

import { useClimateWatchNDCS, useClimateWatchNDCSCountriesDocs } from './hooks';
import Indicator from './indicator';
const ClimateWatchNationalDashboard = () => {
  const { isFetched, isFetching, data } = useClimateWatchNDCS({
    indicators: [
      'M_TarA4',
      'adaptation',
      'pledge_content',
      'M_TarA1',
      'M_TarA2',
      'M_TarA5',
      'M_TarB1',
      'mitigation_contribution_type',
      'M_TarYr',
    ],
  });

  const { data: dataDocuments } = useClimateWatchNDCSCountriesDocs();
  const update = dataDocuments?.update;
  const Indicators = [
    {
      label: 'Emissions reduction <sup>(1)</sup>',
      value:
        data?.M_TarA1?.[data.iso].value.replace('MtCO2', 'MtCO₂') ||
        data?.M_TarA5?.[data.iso].value.replace('MtCO2', 'MtCO₂') ||
        '-',
      check: false,
      info:
        data?.M_TarA1?.info ||
        data?.M_TarA5?.info ||
        'emissions reduction in absolute value (compared to base year or to baseline scenario)',
    },
    {
      label: 'Emissions reduction <sup>(1)</sup> (%)',
      value: data?.M_TarA2?.[data.iso]?.value || data?.M_TarB1?.[data.iso]?.value || '-',
      check: false,
      info:
        data?.M_TarA2?.info ||
        data?.M_TarB1?.info ||
        '% of emissions reduction (compared to base year or to baseline scenario)',
    },
    {
      label: 'Mitigation',
      value: false,
      check:
        !!data?.M_TarA1 || !!data?.M_TarA5 || !!data?.M_TarB1 || !!data?.M_TarA2 ? 'yes' : 'no',
      info: 'NDC contains Mitigation?',
    },
    {
      label: 'Type of mitigation pledge',
      value: data?.mitigation_contribution_type?.[data.iso]?.value,
      check: false,
      info: 'Indicates whether a country has a GHG emissions target, a non-GHG target or both',
    },
    {
      label: 'Adaptation',
      value: false,
      check: data?.adaptation?.[data.iso]?.value,
      info: 'NDC contains Adaptation?',
    },
    {
      label: 'Base year/s',
      value: data?.M_TarA4?.[data.iso]?.value,
      check: false,
      info: 'Year/s against which emission targets are measured against',
    },
    {
      label: 'Target year/s',
      value: data?.M_TarYr?.[data.iso]?.value || '-',
      check: false,
      info: data?.M_TarYr?.info || '',
    },
    {
      label: 'Update status',
      value: update?.long_name,
      check: false,
      info: "Indicates whether this is the country's first NDC or whether it has been updated",
    },
  ];

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading visible={isFetching} iconClassName="flex w-10 h-10 m-auto my-10" />
      {isFetched && data && (
        <>
          <div className="flex justify-between py-4">
            <h3 className={WIDGET_SUBTITLE_STYLE}>NDC</h3>
            <p className="text-sm text-black/85">
              Source:{' '}
              <Link
                href="https://www.climatewatchdata.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-800 underline"
              >
                Global Climate Watch
              </Link>
            </p>
          </div>
          {data.widgetIntroduction && <p>{data.widgetIntroduction}</p>}
          <div className="space-y-5">
            {Indicators.map(({ label, value, info, check }) => (
              <Indicator key={label} label={label} value={value} info={info} check={check} />
            ))}
          </div>
          {<p className="pt-6 text-sm">(1) Compared to base year or to baseline scenario.</p>}
        </>
      )}
    </div>
  );
};

export default ClimateWatchNationalDashboard;
