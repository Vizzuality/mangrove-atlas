import { TooltipPortal } from '@radix-ui/react-tooltip';

import Icon from 'components/icon';
import Loading from 'components/loading';
import { Tooltip, TooltipTrigger, TooltipContent } from 'components/tooltip';
import { WIDGET_CARD_WRAPPER_STYLE, WIDGET_SENTENCE_STYLE } from 'styles/widgets';

import INFO_SVG from 'svgs/ui/info.svg?sprite';

import ClimateWatch from './climate-watch';
import { useMangroveInternationalStatus } from './hooks';
const InternationalStatus = () => {
  const {
    location,
    pledge_type,
    ndc_target,
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
    isLoading,
    isFetched,
    isPlaceholderData,
    noData,
  } = useMangroveInternationalStatus();

  const apostrophe = location?.[location?.length - 1] === 's' ? "'" : "'s";
  if (noData) return null;
  return (
    <div className={WIDGET_CARD_WRAPPER_STYLE}>
      <Loading
        visible={(isPlaceholderData || isLoading) && !isFetched}
        iconClassName="flex w-10 h-10 m-auto my-10"
      />
      {isFetched && !isLoading && (
        <div className="h-full space-y-4">
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
                <p className={WIDGET_SENTENCE_STYLE}>
                  {location}
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
                        className="border-opacity-65 shadow-[0 4px 12px 0 rgba(168,168,168,0.25)] max-w-lg rounded-3xl border-2 border-brand-800 p-5"
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
            <p className={WIDGET_SENTENCE_STYLE}>
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
            <p className={WIDGET_SENTENCE_STYLE}>
              {location}
              {apostrophe} {ndc_updated ? 'updated' : 'first'} NDC pledge{' '}
              {!ndc_adaptation && !ndc_mitigation ? "doesn't include" : 'includes'} coastal and
              marine NBS for mitigation and adaptation.
            </p>
          )}

          {ndc_adaptation && !ndc_mitigation && (
            <p className={WIDGET_SENTENCE_STYLE}>
              {location}
              {apostrophe} {ndc_updated ? 'updated' : 'first'} NDC pledge{' '}
              {!ndc_adaptation && !ndc_mitigation ? "doesn't include" : 'includes'} coastal and
              marine NBS for adaptation.
            </p>
          )}

          {!ndc_adaptation && ndc_mitigation && (
            <p className={WIDGET_SENTENCE_STYLE}>
              {location}
              {apostrophe} {ndc_updated ? 'updated' : 'first'} NDC pledge{' '}
              {!ndc_adaptation && !ndc_mitigation ? "doesn't include" : 'includes'} coastal and
              marine NBS for mitigation &apos.
            </p>
          )}

          {frel && fow && (
            <div className="space-y-4">
              <h3 className="font-bold text-brand-800">Forest Reference Emission Levels</h3>
              <div className="space-y-4">
                <p className={WIDGET_SENTENCE_STYLE}>
                  {location}
                  {apostrophe} {year_frel} FREL is {frel} Mt CO₂e/yr ({location}
                  {apostrophe} mangroves are considered {fow}) .
                </p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <h3 className="font-bold text-brand-800">IPCC Wetlands Supplement</h3>
            {ipcc_wetlands_suplement === 'has' ? (
              <p className={WIDGET_SENTENCE_STYLE}>
                {location} {ipcc_wetlands_suplement} implemented the IPCC Wetlands Supplement.
              </p>
            ) : (
              <p className={WIDGET_SENTENCE_STYLE}>
                There is no information as to whether {location} has implemented the wetlands
                supplement.
              </p>
            )}
          </div>
        </div>
      )}
      <ClimateWatch />
    </div>
  );
};

export default InternationalStatus;
