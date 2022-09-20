import React, { useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import ChartWidget from "components/chart-widget";
import Icon from "components/icon";
import { Tooltip } from "react-tippy";
import { format } from "d3-format";

import TooltipContent from "./tooltip-content";
import styles from "./style.module.scss";

const numberFormat = format(",.2f");

export const MangroveInternationalStatus = ({
  data,
  currentLocation,
  isCollapsed = true,
  slug,
  fetchMangroveInternationalStatusData,
  locationsList,
  ...props
}) => {
  const { id, name } = currentLocation;

  useEffect(() => {
    fetchMangroveInternationalStatusData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
  }, [
    id,
    currentLocation.iso,
    currentLocation.id,
    fetchMangroveInternationalStatusData,
  ]);

  if (!data) return null;
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
  } = data;
  const hasNDCTarget = !!ndc_target && ndc_target > 0;
  const hasNDCReductionTarget =
    !!ndc_reduction_target && ndc_reduction_target > 0;
  const apostrophe = name[name?.length - 1] === "s" ? "'" : "'s";
  const targetYears = target_years?.length > 4 ? "s" : "";
  const reductionTargetSentence =
    !!ndc_reduction_target && ` is a ${ndc_reduction_target}% reduction`;
  const targetYearsSentence =
    !!target_years &&
    (!!hasNDCTarget || !!hasNDCReductionTarget) &&
    ` by target year${targetYears} ${target_years}`;
  const ndcTargetSentence =
    !!ndc_target && `. This represents a reduction of ${ndc_target} tCO2/yr.`;

  return (
    <ChartWidget
      name={name}
      slug={slug}
      filename={slug}
      chart={false}
      isCollapsed={isCollapsed}
      {...props}
    >
      <div slug={slug}>
        {pledge_type && (
          <div>
            <h3 className={styles.title}>
              Nationally Determined Contributions{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.underline}
                href={
                  !hasNDCTarget && !hasNDCReductionTarget
                    ? null
                    : ndc_target_url
                }
                alt="ndc target"
              >
                (NDC)
              </a>
            </h3>
            <Tooltip
              html={ndc_blurb ? <TooltipContent>{ndc_blurb}</TooltipContent> : null}
              position="top-start"
              arrow={true}
              trigger="mouseenter"
            >
              <div className={cx(styles.sentenceWrapper, styles.interactive)}>
                <p>
                  {name}
                  {apostrophe} NDC pledge contains {pledge_type}
                </p>
                <span className={styles.icon}>
                  <Icon name="info" alt="info" />
                </span>
              </div>
            </Tooltip>
          </div>
        )}

        {!pledge_type && (hasNDCTarget || hasNDCReductionTarget) && (
          <div>
            <h3 className={styles.title}>
              Nationally Determined Contributions{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.underline}
                href={
                  !hasNDCTarget && !hasNDCReductionTarget
                    ? null
                    : ndc_target_url
                }
                alt="ndc target"
              >
                (NDC)
              </a>
            </h3>
          </div>
        )}

        <div className={styles.sentenceWrapper}>
          <p>
            {(hasNDCTarget || hasNDCReductionTarget) && `The GHG target`}{" "}
            {!hasNDCReductionTarget && hasNDCTarget && (
              <span>represents a reduction of {ndc_target}</span>
            )}
            {reductionTargetSentence}
            {targetYearsSentence}
            {ndcTargetSentence}
          </p>
        </div>
        <div className={styles.sentenceWrapper}>
          <p>
            {name}
            {apostrophe} {ndc_updated ? "updated" : "first"} NDC pledge{" "}
            {!ndc_adaptation && !ndc_mitigation
              ? "doesn't include"
              : "includes"}{" "}
            coastal and marine NBS {ndc_adaptation}
            {ndc_mitigation}.
          </p>
        </div>

        {frel && fow && (
          <div>
            <h3 className={styles.title}>Forest Reference Emission Levels</h3>
            <div className={styles.sentenceWrapper}>
              <p>
                {name}
                {apostrophe} {year_frel} FREL is {numberFormat(frel)} Mt CO₂e/yr
                ({name}
                {apostrophe} mangroves are considered {fow}) .
              </p>
            </div>
          </div>
        )}
        <div>
          <h3 className={styles.title}>IPCC Wetlands Supplement</h3>
          {ipcc_wetlands_suplement ? (
            <div className={styles.sentenceWrapper}>
              <p>
                {name} {ipcc_wetlands_suplement} implemented the IPCC Wetlands
                Supplement.
              </p>
            </div>
          ) : (
            <div className={styles.sentenceWrapper}>
              <p>
                There is no information as to whether {name} has implemented the
                wetlands supplement
              </p>
            </div>
          )}
        </div>
      </div>
    </ChartWidget>
  );
};

MangroveInternationalStatus.propTypes = {
  data: PropTypes.shape({}),
  currentLocation: PropTypes.shape({}),
};

MangroveInternationalStatus.defaultProps = {
  data: null,
  currentLocation: null,
};

export default MangroveInternationalStatus;
