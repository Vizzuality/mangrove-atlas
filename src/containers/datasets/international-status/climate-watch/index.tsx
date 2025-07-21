import Link from 'next/link';
import { useRouter } from 'next/router';

import { useLocation } from 'containers/datasets/locations/hooks';
import { LocationTypes } from 'containers/datasets/locations/types';

import Loading from 'components/ui/loading';
import { WIDGET_CARD_WRAPPER_STYLE } from 'styles/widgets';

import {
  useClimateWatchNDCS,
  useClimateWatchNDCSContentOverview,
  useClimateWatchNDCSCountriesDocs,
} from './hooks';
import Indicator from './indicator';

const ClimateWatchNationalDashboard = () => {
  const {
    query: { params },
  } = useRouter();
  const locationType = (params?.[0] || 'worldwide') as LocationTypes;
  const id = params?.[1];

  const {
    data: { name, iso },
  } = useLocation(id, locationType);
  const { isFetched, isFetching, data } = useClimateWatchNDCS({
    indicators: [
      'ndce statement',
      'ghg_target',
      'mitigation_contribution_type',
      'adaptation',
      'pledge_base_year',
      'time_target_year',
      'submission_type',
      'indc_submission',
      'base_year',
      'coverage_lulucf',
    ],
  });
  const {
    isFetching: isFetchingNDCSContentOverview,
    data: NDCSContentOverview,
    isFetched: isFetchedNDCSContentOverview,
  } = useClimateWatchNDCSContentOverview();

  const { data: dataDocuments } = useClimateWatchNDCSCountriesDocs(
    {
      documentSlug: NDCSContentOverview?.document_slug,
    },
    {
      enabled: !!NDCSContentOverview?.document_slug,
    }
  );
  const update = dataDocuments?.update;

  const Indicators = [
    {
      label: 'Mitigation',
      value: false,
      check:
        NDCSContentOverview?.mitigation_contribution_type.toLowerCase() === 'yes' ||
        (!!NDCSContentOverview?.mitigation_contribution_type.length &&
          NDCSContentOverview?.mitigation_contribution_type.toLowerCase() !== 'no'),
      info: 'NDC contains Mitigation?',
    },
    {
      label: 'Type of mitigation pledge',
      value: NDCSContentOverview?.mitigation_contribution_type,
      check: false,
      info: 'Indicates whether a country has a GHG emissions target, a non-GHG target or both',
    },
    {
      label: 'Adaptation',
      value: false,
      check: NDCSContentOverview?.adaptation.toLowerCase() === 'yes',
      info: 'NDC contains Adaptation?',
    },
    // {
    //   label: 'Base year/s',
    //   value: NDCSContentOverview?.base_year,
    //   check: false,
    //   info: 'Year/s against which emission targets are measured against',
    // },
    {
      label: 'Target year/s',
      value: NDCSContentOverview?.time_target_year || '-',
      check: false,
      info: data?.time_target_year?.info || '',
    },
    {
      label: 'Mitigation: Sector Coverage',
      value: NDCSContentOverview?.coverage_lulucf
        ? 'LULUCF included in the NDC'
        : 'LULUCF not included in the NDC',
      check: false,
      info: "Does the NDC's GHG target cover the LULUCF (Land Use, Land-Use Change, and Forestry) sector?",
    },
    {
      label: 'Update status',
      value: update?.value,
      url: update?.url,
      check: false,
      info: "Indicates whether this is the country's first NDC or whether it has been updated",
    },
  ];

  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={isFetching || isFetchingNDCSContentOverview}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && isFetchedNDCSContentOverview && data && NDCSContentOverview && (
        <>
          <div className="relative">
            <div className="absolute -left-8 -right-8 h-px bg-brand-800 bg-opacity-30" />
          </div>
          <div className="flex justify-between py-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.climatewatchdata.org/ndcs/country/${iso}`}
              className="font-bold underline hover:text-brand-800"
            >
              NDC {name}
            </a>
            <p className="space-x-1 text-sm text-black/85">
              <span>Source:</span>
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
            <div dangerouslySetInnerHTML={{ __html: NDCSContentOverview?.indc_summary }} />
            {Indicators.map((indicator) => (
              <Indicator key={indicator.label} {...indicator} />
            ))}
          </div>
          {<p className="pt-6 text-sm">(1) Compared to base year or to baseline scenario.</p>}
        </>
      )}
    </div>
  );
};

export default ClimateWatchNationalDashboard;
