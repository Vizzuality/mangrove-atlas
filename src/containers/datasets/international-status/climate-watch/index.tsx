import Link from 'next/link';

import Loading from 'components/loading';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SUBTITLE_STYLE } from 'styles/widgets';

import { useClimateWatchNDCS, useClimateWatchNDCSCountriesDocs } from './hooks';
import Indicator from './indicator';
import { IndicatorsParams } from './types';
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

  const Indicators = [
    {
      label: 'Emissions reduction <sup>(1)</sup>',
      value: 'a maximum of 42.5 MtCO2e by 2030',
      check: false,
      info: 'info',
    },
    {
      label: 'Emissions reduction <sup>(1)</sup> (%)',
      value: 'at least -55%',
      check: false,
      info: 'info',
    },
    {
      label: 'Mitigation',
      value: null,
      check: true,
      info: 'info',
    },
    {
      label: 'Type of mitigation pledge',
      value: 'a GHG target and actions',
      check: false,
      info: 'info',
    },
    {
      label: 'Adaptation',
      value: null,
      check: false,
      info: 'info',
    },
    {
      label: 'Base year/s',
      value: '2025 and 2030',
      check: false,
      info: 'info',
    },
    {
      label: 'Target year/s',
      value: '2030',
      check: false,
      info: 'info',
    },
    {
      label: 'Update status',
      value: 'first NDC',
      check: false,
      info: 'info',
    },
  ];

  const { data: data2 } = useClimateWatchNDCSCountriesDocs();

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
          <p>Lorem ipsum dolor sit amet consectetur. Lectus et quam tempus morbi.</p>
          <div className="space-y-5">
            {Indicators.map(({ label, value, info, check }, index) => (
              <Indicator key={label} label={label} value={value} info={info} check={check} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClimateWatchNationalDashboard;
