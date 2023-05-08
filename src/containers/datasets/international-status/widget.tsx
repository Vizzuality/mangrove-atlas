import { currentLocationAtom } from 'store/location';
import { widgetYearAtom } from 'store/widget';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';

import { useMangroveInternationalStatus } from './hooks';

const HabitatExtent = () => {
  const currentLocationId = useRecoilValue(currentLocationAtom);
  const currentYear = useRecoilValue(widgetYearAtom);
  const { data } = useLocation(currentLocationId);
  const { name, location_id } = data;

  const { data: InternationalStatusData, isLoading } = useMangroveInternationalStatus(
    {
      ...(!!location_id && { location_id }),
      year: currentYear,
    },
    {}
  );

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
  } = data;
  const apostrophe = name[name?.length - 1] === 's' ? "'" : "'s";

  // .sentenceWrapper {
  //   display: flex;
  //   align-items: center;

  //   &.interactive {
  //     cursor: pointer;
  //   }

  //   .icon {
  //     width: 15px;
  //     height: 15px;
  //     border: 2px solid rgba(#00857F, 0.2);
  //     box-sizing: border-box;
  //     border-radius: 15px;
  //     margin-left: 5px;
  //     margin-top: -10px;
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;

  //     svg {
  //       width: 10px;
  //       height: 10px;
  //       fill: $primary;
  //     }
  //   }
  // }

  return (
    <div>
      {pledge_type && (
        <div>
          <h3 className="text-brand-400">
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
          {/* <Tooltip
            html={ndc_blurb ? <TooltipContent>{ndc_blurb}</TooltipContent> : null}
            position="top-start"
            arrow={true}
            trigger="mouseenter"
          >
            <div className={cx("styles.sentenceWrapper", styles.interactive)}>
              <p>
                {name}
                {apostrophe} NDC pledge contains {pledge_type}
              </p>
              <span className={styles.icon}>
                <Icon name="info" title="info" />
              </span>
            </div>
          </Tooltip> */}
        </div>
      )}

      {!pledge_type &&
        (hasNDCTarget || hasNDCReductionTarget || ndc_adaptation || ndc_mitigation) && (
          <div>
            <h3 className="text-brand-400">
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
        <div className={'styles.sentenceWrapper'}>
          <p>
            {`The GHG target`}{' '}
            {!hasNDCReductionTarget && hasNDCTarget && (
              <span>represents a reduction of {ndc_target}</span>
            )}
            {reductionTargetSentence}
            {targetYearsSentence}
            {ndcTargetSentence}
          </p>
        </div>
      )}
      {ndc_adaptation && ndc_mitigation && (
        <div className={'styles.sentenceWrapper'}>
          <p>
            {name}
            {apostrophe} {ndc_updated ? 'updated' : 'first'} NDC pledge{' '}
            {!ndc_adaptation && !ndc_mitigation ? "doesn't include" : 'includes'} coastal and marine
            NBS for mitigation and adaptation.
          </p>
        </div>
      )}

      {ndc_adaptation && !ndc_mitigation && (
        <div className={'styles.sentenceWrapper'}>
          <p>
            {name}
            {apostrophe} {ndc_updated ? 'updated' : 'first'} NDC pledge{' '}
            {!ndc_adaptation && !ndc_mitigation ? "doesn't include" : 'includes'} coastal and marine
            NBS for adaptation.
          </p>
        </div>
      )}

      {!ndc_adaptation && ndc_mitigation && (
        <div className={'styles.sentenceWrapper'}>
          <p>
            {name}
            {apostrophe} {ndc_updated ? 'updated' : 'first'} NDC pledge{' '}
            {!ndc_adaptation && !ndc_mitigation ? "doesn't include" : 'includes'} coastal and marine
            NBS for mitigation &apos.
          </p>
        </div>
      )}

      {frel && fow && (
        <div>
          <h3 className="text-brand-400">Forest Reference Emission Levels</h3>
          <div className={'styles.sentenceWrapper'}>
            <p>
              {name}
              {apostrophe} {year_frel} FREL is {frel} Mt CO₂e/yr ({name}
              {apostrophe} mangroves are considered {fow}) .
            </p>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-brand-400">IPCC Wetlands Supplement</h3>
        {ipcc_wetlands_suplement === 'has' ? (
          <div className={'styles.sentenceWrapper'}>
            <p>
              {name} {ipcc_wetlands_suplement} implemented the IPCC Wetlands Supplement.
            </p>
          </div>
        ) : (
          <div className={'styles.sentenceWrapper'}>
            <p>
              There is no information as to whether {name} has implemented the wetlands supplement
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitatExtent;
