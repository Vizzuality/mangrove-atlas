import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";

import { format } from "d3-format";

import config from "./config";

import Widget from "components/widget";
import Chart from "components/chart";
import Select from "components/select";
import Icon from "components/icon";
import WidgetLegend from "components/widget-legend";

import styles from "components/widget/style.module.scss";
import widgetStyles from "widget-components/mangrove-restoration/style.module.scss";

import { MANGROVE_RESTORATION_POTENTIAL_CHART_LABELS } from './constants';

const numberFormat = format(",.2f");

function MangroveRestoration({
  component,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui: { restoration: uiRestoration },
  fetchMangroveRestorationData,
  fetchMangroveDegradationAndLossData,
  fetchMangroveEcosystemServicesData,
  restorationData,
  restorationDataMetadata,
  degradationAndLossData,
  ecosystemServicesData,
  isLoading,
  setUi,
  ui,
  ...props
}) {
  const years = restorationDataMetadata?.year || [];

  const year = useMemo(() => uiRestoration?.year || years[years.length - 1], [uiRestoration, years]);
  const unit = useMemo(() => uiRestoration?.unit, [uiRestoration]);
  const unitRestorationPotential = useMemo(() => !isLoading && restorationDataMetadata?.units?.restoration_potential_score, [isLoading]);

  const restorationPotentialScore = !isLoading && restorationData?.restorable_area_perc;

  const { location_id } = currentLocation;
  
  const [lineChartWidth, setLineChartWidth] = useState(null);
  const lineChartRef = useRef();
  
  useEffect(() => {
    const properties = lineChartRef?.current?.getBoundingClientRect();
    setLineChartWidth(properties?.width);
  },[lineChartRef]);

  useEffect(() => {
    if (!location_id) {
      fetchMangroveRestorationData();
      fetchMangroveDegradationAndLossData();
      fetchMangroveEcosystemServicesData();
    }
    if (!isLoading) {
      addFilter({
        filter: {
          id: 'restoration',
          year,
          unit,
        }
      });
      setUi({ id: "restoration", value: { year } });
      fetchMangroveRestorationData({ location_id, unit });
      fetchMangroveDegradationAndLossData({ location_id });
      fetchMangroveEcosystemServicesData({ location_id });
    }
  }, [
    addFilter,
    unit,
    year,
    location_id,
    fetchMangroveRestorationData,
    fetchMangroveDegradationAndLossData,
    fetchMangroveEcosystemServicesData
  ]);

  const {
    chartRingData,
    chartValueData,
    chartRingConfig,
    chartValueConfig,
    chartTreeConfig,
  } = config.parse(restorationData, degradationAndLossData, ecosystemServicesData, year, unitRestorationPotential);

  const changeYear = (current) => {
    addFilter({
      filter: {
        ...ui,
        id: "restoration",
        year: current,
      },
    });
    setUi({ id: "restoration", value: { year: current } });
  };

  if (!restorationData) {
    return null;
  }

  const optionsYears = sortBy(
    years.map((year) => ({
      label: year.toString(),
      value: year,
    })),
    ["value"]
  );

  const location =
    currentLocation.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{`${currentLocation.name}`}</span>
    );

  const totalAreaProtected = numberFormat(restorationData.restorable_area);
  const totalArea = numberFormat(restorationData.mangrove_area_extent);

  const displayYear =
    optionsYears.length > 1 ? (
      <Select
        className="notranslate"
        width="auto"
        value={year || years[years.length - 1]}
        options={optionsYears}
        onChange={changeYear}
      />
    ) : (
      optionsYears[0].label
    );

  const widgetDataRing = {
    data: chartRingData,
    config: chartRingConfig,
  };

  const widgetDataTree = {
    data: restorationData,
    config: chartTreeConfig,
  };

  const widgetDataValue = {
    data: chartValueData,
    config: chartValueConfig,
  };

  const lossDriver = "Commodities";

  // charts sentences
  const restorationPotentialLineSentence = (
    <>
      The mean restoration potential score for
      <strong>
        &nbsp;{location} is {numberFormat(restorationPotentialScore)}%
      </strong>
    </>
  );

  const restorationPotentialRingSentence = (
    <>
      Mangroves in protected areas in
      <strong>&nbsp;{location}&nbsp;</strong>
      in &nbsp;<strong>{displayYear}</strong> represented{" "}
      <strong>
        {totalAreaProtected} {unitRestorationPotential}
      </strong>{" "}
      of{" "}
      <strong>
        {totalArea} {unitRestorationPotential}
      </strong>
      .
    </>
  );

  const restorationPotentialTreeMapSentence = (
    <>
      The main mangrove loss driver in <strong>{location}</strong> is{" "}
      <strong>{lossDriver}</strong> (rice, shrimp, and oil palm cultivation)
    </>
  );

  const restorationPotentialValue = (
    <>
      The restoration of mangroves in <strong>{location}</strong> would increase the value of the following ecosystem services:
    </>
  );
  
  const trianglePosition = ((lineChartWidth * restorationPotentialScore) / 100) - 7; // substract icon size

  if (!restorationData.restoration_potential_score) return null;

  return (
      <Widget className={styles.widget} {...props} name={name}>
        <div className={widgetStyles.restorationChartWrapper}>
          <div className={widgetStyles.subtitle}>overview</div>
          <div className={styles.restorationPotentialSentence} key={Date.now()}>
            {restorationPotentialLineSentence}
          </div>
          <div>
          <span className={widgetStyles.restorationPotentialUnit}>{unitRestorationPotential}</span>
          <WidgetLegend groups={{ MANGROVE_RESTORATION_POTENTIAL_CHART_LABELS }} type="height" />
          </div>
            
            <div ref={lineChartRef} className={widgetStyles.lineChartWidget}>
            <Icon
              name="play"
              className={widgetStyles.lineChartIcon}
              style={{ left: trianglePosition }}
            />
          </div>
          <hr className={widgetStyles.breakLineDashed} />
        </div>

        <div className={widgetStyles.restorationChartWrapper}>
        <div className={widgetStyles.subtitle}>Mangrove degradation and loss</div>
          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialRingSentence}
          </div>
          <Chart
            {...props}
            name={name}
            slug={slug}
            filename={slug}
            isCollapsed={isCollapsed}
            sentence={restorationPotentialRingSentence}
            data={chartRingData}
            config={chartRingConfig}
            chartData={widgetDataRing}
          />

          <hr className={widgetStyles.breakLine} />
        </div>

        <div className={widgetStyles.restorationChartWrapper}>
          <div className={widgetStyles.subtitle}>Mangrove degradation and loss</div>
          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialTreeMapSentence}
          </div>

          <div className={widgetStyles.treemap}>
          <WidgetLegend groups={chartTreeConfig.legend} type="blue-carbon" unit="ha" classname="maxWidth" />
          <div className={widgetStyles.treemapChart}>

            <Chart
              className={widgetStyles.breakLine}
              {...props}
              name={name}
              slug={slug}
              filename={slug}
              isCollapsed={isCollapsed}
              sentence={restorationPotentialTreeMapSentence}
              data={degradationAndLossData}
              config={chartTreeConfig}
              chartData={widgetDataTree}
              />
              </div>
          </div>
        {/* <hr className={widgetStyles.breakLine} /> */}
        </div>
{/* 
        <div className={widgetStyles.restorationChartWrapper}>
        <div className={widgetStyles.subtitle}>mangrove restoration value</div>
          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialValue}
          </div>
          <Chart
            {...props}
            name={name}
            slug={slug}
            filename={slug}
            isCollapsed={isCollapsed}
            sentence={restorationPotentialValue}
            data={chartValueData}
            config={chartValueConfig}
            chartData={widgetDataValue}
          />

        </div> */}
      </Widget>
  );
}

MangroveRestoration.propTypes = {
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
  ui: PropTypes.string,
  setUi: PropTypes.func,
};

MangroveRestoration.defaultProps = {
  currentLocation: null,
  addFilter: () => {},
  isCollapsed: false,
  slug: null,
  name: null,
  metadata: null,
  ui: null,
  setUi: () => {},
};

export default MangroveRestoration;
