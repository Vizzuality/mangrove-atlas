import cn from 'lib/classnames';

import { currentLocationAtom } from 'store/location';
import { widgetYearAtom } from 'store/widget';

import { TooltipPortal } from '@radix-ui/react-tooltip';
import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import Icon from 'components/icon';
import { Tooltip, TooltipTrigger, TooltipContent } from 'components/tooltip';

import INFO_SVG from 'svgs/ui/info.svg?sprite';

import { useMangroveInternationalStatus } from './hooks';

const HabitatExtent = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const currentYear = useRecoilValue(widgetYearAtom);
  const { data } = useLocation(currentLocationId);
  const { name, location_id } = data;

  const {
    pledge_type,
    ndc_target,
    ndc_reduction_target,
    target_years,
    ndc_target_url,
    ndc_updated,
    ndc_mitigation,
    ndc_adaptation,
    ipcc_wetlands_suplement,
    frel,
    year_frel,
    fow,
    ndc_blurb,
    reductionTargetSentence,
    targetYearsSentence,
    ndcTargetSentence,
    hasNDCTarget,
    hasNDCReductionTarget,
  } = useMangroveInternationalStatus(
    {
      ...(!!location_id && { location_id }),
      year: currentYear,
    },
    {}
  );

  const apostrophe = name?.[name?.length - 1] === 's' ? "'" : "'s";

  return (
    <div className="mb-10 h-full space-y-4">
      {pledge_type && (
        <div className="space-y-4">
          <h3 className="font-bold text-brand-800">
            Nationally Determined Contributions{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              href={!hasNDCTarget && !hasNDCReductionTarget ? null : ndc_target_url}
              title="ndc target"
            >
              (NDC)
            </a>
          </h3>
          <div className="flex items-start space-x-2">
            <p>
              {name}
              {apostrophe} NDC pledge contains {pledge_type}
            </p>
            {!!ndc_blurb && (
              <Tooltip>
                <TooltipTrigger>
                  <button className="" aria-label="Info" type="button">
                    <Icon icon={INFO_SVG} />
                  </button>
                </TooltipTrigger>

                <TooltipPortal>
                  <TooltipContent
                    side="left"
                    align="center"
                    className="border-opacity-65 shadow-[0 4px 12px 0 rgba(168,168,168,0.25)] max-w-lg rounded-[20px] border-2 border-brand-800 p-5"
                  >
                    <div className="flex items-center space-x-2">{ndc_blurb}</div>
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      {!pledge_type &&
        (hasNDCTarget || hasNDCReductionTarget || ndc_adaptation || ndc_mitigation) && (
          <div className="space-y-4">
            <h3 className="font-bold text-brand-800">
              Nationally Determined Contributions{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                href={!hasNDCTarget && !hasNDCReductionTarget ? null : ndc_target_url}
                title="ndc target"
              >
                (NDC)
              </a>
            </h3>
          </div>
        )}

      {(hasNDCTarget || hasNDCReductionTarget) && (
        <p>
          {`The GHG target`}{' '}
          {!hasNDCReductionTarget && hasNDCTarget && (
            <span>represents a reduction of {ndc_target}</span>
          )}
          {reductionTargetSentence}
          {targetYearsSentence}
          {ndcTargetSentence}
        </p>
      )}
      {ndc_adaptation && ndc_mitigation && (
        <p>
          {name}
          {apostrophe} {ndc_updated ? 'updated' : 'first'} NDC pledge{' '}
          {!ndc_adaptation && !ndc_mitigation ? "doesn't include" : 'includes'} coastal and marine
          NBS for mitigation and adaptation.
        </p>
      )}

      {ndc_adaptation && !ndc_mitigation && (
        <p>
          {name}
          {apostrophe} {ndc_updated ? 'updated' : 'first'} NDC pledge{' '}
          {!ndc_adaptation && !ndc_mitigation ? "doesn't include" : 'includes'} coastal and marine
          NBS for adaptation.
        </p>
      )}

      {!ndc_adaptation && ndc_mitigation && (
        <p>
          {name}
          {apostrophe} {ndc_updated ? 'updated' : 'first'} NDC pledge{' '}
          {!ndc_adaptation && !ndc_mitigation ? "doesn't include" : 'includes'} coastal and marine
          NBS for mitigation &apos.
        </p>
      )}

      {frel && fow && (
        <div className="space-y-4">
          <h3 className="font-bold text-brand-800">Forest Reference Emission Levels</h3>
          <div className="space-y-4">
            <p>
              {name}
              {apostrophe} {year_frel} FREL is {frel} Mt CO₂e/yr ({name}
              {apostrophe} mangroves are considered {fow}) .
            </p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <h3 className="font-bold text-brand-800">IPCC Wetlands Supplement</h3>
        {ipcc_wetlands_suplement === 'has' ? (
          <p>
            {name} {ipcc_wetlands_suplement} implemented the IPCC Wetlands Supplement.
          </p>
        ) : (
          <p>
            There is no information as to whether {name} has implemented the wetlands supplement
          </p>
        )}
      </div>
    </div>
  );
};

export default HabitatExtent;
