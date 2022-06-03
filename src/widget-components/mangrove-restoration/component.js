import React, { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";
import { InView } from "react-intersection-observer";

import { format } from "d3-format";

import config from "./config";

import Widget from "components/widget";
import Chart from "components/chart";
import Select from "components/select";
import Icon from "components/icon";
import WidgetLegend from "components/widget-legend";

import styles from "components/widget/style.module.scss";
import widgetStyles from "widget-components/mangrove-restoration/style.module.scss";

import { fetchMangroveRestorationPotential, fetchMangroveDegradationAndLoss } from 'services/api-service';

const numberFormat = format(",.2f");

function MangroveRestoration({
  data,
  component,
  currentLocation,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui: { year, unit },
  setUi,
  ui,
  ...props
}) {
  // TO DO - update when data is ready
  // const { metadata: { units, years }, data: dataTotal } = data;

  const years = useMemo(() => [2010], []);
  const units = useMemo(() => ["ha", "% mg Ha"], []);
  const unitRestorationPotential = '% mg Ha';
  const restorationPotentialScore = 68;

  const { location_id } = currentLocation;

  const [lineChartWidth, setLineChartWidth] = useState(null);
  const lineChartRef = useRef();

  useEffect(() => {
    const properties = lineChartRef?.current?.getBoundingClientRect();
    setLineChartWidth(properties?.width);
  },[lineChartRef]);

  useEffect(() => {
    addFilter({
      filter: {
        id: "restoration",
        year: years[years.length - 1],
        unit: units[0],
      },
    });

    fetchMangroveRestorationPotential(location_id);
    fetchMangroveDegradationAndLoss(location_id)
    setUi({
      id: "restoration",
      value: { year: year || years[years.length - 1], unit: unit || units[0] },
    });
  }, [addFilter, year, unit, currentLocation]);
  if (!data) {
    return null;
  }
  const parsedData =
    unit === "ha"
      ? data
      : {
          ...data,
          total_area: data.total_area / 100,
          protected_area: data.protected_area / 100,
        };

  const {
    chartLineData,
    chartRingData,
    chartRingConfig,
    chartTreeData,
    chartTreeConfig,
  } = config.parse(parsedData, unit);

  if (!chartLineData || !chartRingData || !chartTreeData) {
    return null;
  }
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

  const changeUnit = (current) => {
    addFilter({
      filter: {
        ...ui,
        id: "restoration",
        unit: current,
      },
    });
    setUi({ id: "restoration", value: { unit: current } });
  };

  if (!data) {
    return null;
  }

  const optionsYears = sortBy(
    years.map((year) => ({
      label: year.toString(),
      value: year,
    })),
    ["value"]
  );

  const optionsUnits = sortBy(
    units.map((unit) => ({
      label: unit.toString(),
      value: unit,
    })),
    ["value"]
  );

  const location =
    currentLocation.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{`${currentLocation.name}`}</span>
    );

  const totalAreaProtected = numberFormat(parsedData.protected_area);
  const totalArea = numberFormat(parsedData.total_area);

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

  const displayUnit =
    units.length > 1 ? (
      <Select
        className="notranslate"
        width="auto"
        value={unit || units[0]}
        options={optionsUnits}
        onChange={changeUnit}
      />
    ) : (
      units[0].label
    );

  const widgetDataRing = {
    data: chartRingData,
    config: chartRingConfig,
  };

  const widgetDataTree = {
    data: chartTreeData,
    config: chartTreeConfig,
  };

  const lossDriver = "Commodities";

  // charts sentences
  const restorationPotentialLineSentence = (
    <>
      The mean restoration potential score for
      <strong>
        &nbsp;{location} is {restorationPotentialScore}%;
      </strong>
    </>
  );

  const restorationPotentialRingSentence = (
    <>
      Mangroves in protected areas in
      <strong>&nbsp;{location}&nbsp;</strong>
      in &nbsp;<strong>{displayYear}</strong> represented{" "}
      <strong>
        {totalAreaProtected} {displayUnit}
      </strong>{" "}
      of{" "}
      <strong>
        {totalArea} {displayUnit}
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

  const labels = [
    { color: '#D6EDFD', value: '0-20' },
    { color: '#90ACF6', value: '20-40' },
    { color: '#7768E9', value: '40-60' },
    { color: '#793DD2', value: '60-80' },
    { color: '#831C9D', value: '80-100' }
  ];
  const trianglePosition = ((lineChartWidth * restorationPotentialScore) / 100) - 7; // substract icon size

  return (
    <div className={widgetStyles.widgetWidth}>
      <Widget className={styles.widget} {...props} name={name}>
        <div className={widgetStyles.restorationChartWrapper}>
          <div className={styles.restorationPotentialSentence} key={Date.now()}>
            {restorationPotentialLineSentence}
          </div>
          <div className={widgetStyles.subtitle}>overview</div>
          <div>
          <span className={widgetStyles.restorationPotentialUnit}>{unitRestorationPotential}</span>
          <WidgetLegend groups={{ labels }} type="height" />
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
            className={""}
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
          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialTreeMapSentence}
          </div>

          <div className={widgetStyles.treemap}>
          <WidgetLegend groups={{ labels }} type="height" />

            <Chart
              className={widgetStyles.breakLine}
              {...props}
              name={name}
              slug={slug}
              filename={slug}
              isCollapsed={isCollapsed}
              sentence={restorationPotentialTreeMapSentence}
              data={chartTreeData}
              config={chartTreeConfig}
              chartData={widgetDataTree}
            />
          </div>
          {component}
        </div>

        <div className={widgetStyles.restorationChartWrapper}>
        <div className={widgetStyles.subtitle}>mangrove restoration value</div>

          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialRingSentence}
          </div>
          <Chart
            className={""}
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
      </Widget>
    </div>
  );
}

MangroveRestoration.propTypes = {
  data: PropTypes.shape({}),
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
  data: null,
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
