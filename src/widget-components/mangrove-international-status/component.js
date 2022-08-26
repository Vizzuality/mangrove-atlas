import React, { useEffect } from "react";
import PropTypes from "prop-types";

import ChartWidget from "components/chart-widget";

import styles from "./style.module.scss";

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
  }, [id, currentLocation.iso, currentLocation.id, fetchMangroveInternationalStatusData]);

  if (!data) return null;
  const {
    pledge_type,
    ndc_target,
    ndc_reduction_target,
    base_years,
    target_years,
    ndc_target_url,
    ndc_updated,
    ndc_mitigation,
    ndc_adaptation,
    ipcc_wetlands_suplement,
    frel,
    year_frel,
    fow,
  } = data;

  const apostrophe = name[name.length - 1] === "s" ? "'" : "'s";
  const targetYears = target_years.length > 4 ? "s" : "";
  const reductionTargetSentence =
    ndc_reduction_target && ` is a ${ndc_reduction_target}% reduction`;
  const baseYearsSentence = base_years && ` from a baseline in ${base_years}`;
  const targetYearsSentence =
    !!target_years && `by target year${targetYears} ${target_years}`;
  const ndcTargetSentence =
    !!ndc_target && `. This represents a reduction of ${ndc_target}mtCO2e/yr.`;

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
              Nationally Determined Contributions (NDC)
            </h3>
            <div className={styles.sentenceWrapper}>
              <p>
                {name}
                {apostrophe} NDC pledge contains {pledge_type}
              </p>
            </div>
            <div className={styles.sentenceWrapper}>
              <p>
                {(ndc_target || ndc_reduction_target) && `The GHG target`}
                {!ndc_reduction_target &&
                  !!ndc_target &&
                  "represents a reduction of" && (
                    <a
                      className={styles.link}
                      href={ndc_target_url}
                      alt="ndc target"
                    >
                      {ndc_target}
                    </a>
                  )}
                {reductionTargetSentence}
                {baseYearsSentence} {targetYearsSentence}
                {ndcTargetSentence}
                {!ndc_target && !ndc_reduction_target && "No data"}
              </p>
            </div>
            <div className={styles.sentenceWrapper}>
              <p>
                {name} {ndc_updated ? "updated" : "first"} NDC pledge{" "}
                {!ndc_adaptation && !ndc_mitigation
                  ? "doesn't include"
                  : "includes"}{" "}
                coastal and marine NBS {ndc_adaptation}
                {ndc_mitigation}.
              </p>
            </div>
          </div>
        )}

        {frel && (
          <div>
            <h3 className={styles.title}>Forest Reference Emission Levels</h3>
            <div className={styles.sentenceWrapper}>
              <p>
                {name}
                {apostrophe} {year_frel} FREL is {frel} Mt CO₂e/yr ({name}
                {apostrophe} mangroves are considered {fow}) .
              </p>
            </div>
          </div>
        )}

        <div>
          <h3 className={styles.title}>IPCC Wetlands Supplement</h3>
          <div className={styles.sentenceWrapper}>
            <p>
              {name} {ipcc_wetlands_suplement} implemented the IPCC Wetlands
              Supplement.
            </p>
          </div>
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
