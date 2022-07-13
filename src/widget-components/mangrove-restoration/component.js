<<<<<<< HEAD
import React, { useEffect, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";
import { InView } from "react-intersection-observer";

import { format } from "d3-format";

import config from "./config";

import Widget from "components/widget";
=======
import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";
import { format } from "d3-format";

import { getLocationType, getCurrentLocation } from 'modules/pages/sagas';

// components
import ChartWidget from 'components/chart-widget';
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
import Chart from "components/chart";
import Select from "components/select";
import Icon from "components/icon";
import WidgetLegend from "components/widget-legend";
<<<<<<< HEAD

import styles from "components/widget/style.module.scss";
import widgetStyles from "widget-components/mangrove-restoration/style.module.scss";

import { fetchMangroveRestorationPotential, fetchMangroveDegradationAndLoss } from 'services/api-service';
=======
import styles from "components/widget/style.module.scss";

import widgetStyles from "widget-components/mangrove-restoration/style.module.scss";

import { MANGROVE_RESTORATION_POTENTIAL_CHART_LABELS } from './constants';
import config from "./config";
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363

const numberFormat = format(",.2f");

function MangroveRestoration({
<<<<<<< HEAD
  data,
  component,
  currentLocation,
=======
  component,
  currentLocationId,
  currentId,
  locations,
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
  isCollapsed = true,
  slug,
  name,
  addFilter,
<<<<<<< HEAD
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

=======
  ui: { restoration: uiRestoration, degradationAndLoss: uiDegradationAndLoss },
  fetchMangroveRestorationData,
  fetchMangroveDegradationAndLossData,
  degradationAndLossDataMetadata,
  fetchMangroveEcosystemServicesData,
  restorationData,
  restorationDataMetadata,
  degradationAndLossData,
  degradationAndLossMetadata,
  ecosystemServicesData,
  ecosystemServicesMetadata,
  isLoading,
  setUi,
  type,
  ...props
}) {
  const [lineChartWidth, setLineChartWidth] = useState(null);
  const lineChartRef = useRef();

  const yearRestoration = useMemo(() => uiRestoration?.year || restorationDataMetadata?.year[restorationDataMetadata.year.length - 1], [uiRestoration, restorationDataMetadata]);
  const unit = useMemo(() => uiRestoration?.unit, [uiRestoration]);
  const yearDegradationAndLoss = useMemo(() => uiDegradationAndLoss?.year || degradationAndLossDataMetadata?.year[degradationAndLossDataMetadata.year.length - 1], [uiDegradationAndLoss, degradationAndLossDataMetadata]);

>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
  useEffect(() => {
    const properties = lineChartRef?.current?.getBoundingClientRect();
    setLineChartWidth(properties?.width);
  },[lineChartRef]);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    fetchMangroveRestorationData({ ...currentLocationId && currentId !== 'worldwide' && { location_id: currentLocationId }});
    fetchMangroveDegradationAndLossData({ ...currentLocationId && currentId !== 'worldwide' && { location_id: currentLocationId }});
    fetchMangroveEcosystemServicesData({ ...currentLocationId && currentId !== 'worldwide' && { location_id: currentLocationId }});

    if (!isLoading) {
      addFilter({
        filter: {
          id: 'restoration',
          year: yearRestoration,
          unit,
        }
      });
      setUi({ id: "restoration", value: { year: yearRestoration } });
      addFilter({
        filter: {
          id: 'degradation_and_loss',
          year: yearDegradationAndLoss,
          unit,
        }
      });
      setUi({ id: "degradation_and_loss", value: { year: yearDegradationAndLoss } });
    }
  }, [
    addFilter,
    unit,
    yearRestoration,
    yearDegradationAndLoss,
    currentLocationId,
    fetchMangroveRestorationData,
    fetchMangroveDegradationAndLossData,
    fetchMangroveEcosystemServicesData,
    currentId,
  ]);

  const locationType = getLocationType(type);
  const currentLocation = getCurrentLocation(locations.list, currentId, locationType)
  
  const years = restorationDataMetadata?.year || [];
  
  const unitRestorationPotential = useMemo(() => !isLoading && restorationDataMetadata?.units?.restoration_potential_score, [isLoading]);

  const restorationPotentialScore = !isLoading && restorationData?.restoration_potential_score;
  
  const {
    chartRingData,
    chartRingConfig,
    chartValueData,
    chartValueConfig,
    chartTreeConfig,
  } = config.parse(restorationData, degradationAndLossData, ecosystemServicesData, ecosystemServicesMetadata, yearRestoration, unitRestorationPotential);

  const changeYear = (current) => {
    addFilter({
      filter: {
        ...uiRestoration,
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
        id: "restoration",
        year: current,
      },
    });
    setUi({ id: "restoration", value: { year: current } });
  };

<<<<<<< HEAD
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
=======
  if (!restorationData) {
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
    return null;
  }

  const optionsYears = sortBy(
    years.map((year) => ({
      label: year.toString(),
      value: year,
    })),
    ["value"]
  );

<<<<<<< HEAD
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
=======
  const location =
  currentLocation?.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{`${currentLocation?.name}`}</span>
    );
console.log(isCollapsed)
  const totalAreaProtected = numberFormat(restorationData.restorable_area);
  const totalArea = numberFormat(restorationData.mangrove_area_extent);
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363

  const displayYear =
    optionsYears.length > 1 ? (
      <Select
        className="notranslate"
        width="auto"
<<<<<<< HEAD
        value={year || years[years.length - 1]}
=======
        value={yearRestoration}
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
        options={optionsYears}
        onChange={changeYear}
      />
    ) : (
      optionsYears[0].label
    );

<<<<<<< HEAD
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

=======
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
  const widgetDataRing = {
    data: chartRingData,
    config: chartRingConfig,
  };

  const widgetDataTree = {
<<<<<<< HEAD
    data: chartTreeData,
    config: chartTreeConfig,
  };

  const lossDriver = "Commodities";
=======
    data: restorationData,
    config: chartTreeConfig,
  };

  const widgetDataValue = {
    data: chartValueData,
    config: chartValueConfig,
  };

  const lossDriver = degradationAndLossMetadata?.main_loss_driver || "Commodities";
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363

  // charts sentences
  const restorationPotentialLineSentence = (
    <>
      The mean restoration potential score for
      <strong>
<<<<<<< HEAD
        &nbsp;{location} is {restorationPotentialScore}%;
=======
        &nbsp;{location} is {restorationPotentialScore}%
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
      </strong>
    </>
  );

  const restorationPotentialRingSentence = (
    <>
      Mangroves in protected areas in
      <strong>&nbsp;{location}&nbsp;</strong>
      in &nbsp;<strong>{displayYear}</strong> represented{" "}
      <strong>
<<<<<<< HEAD
        {totalAreaProtected} {displayUnit}
      </strong>{" "}
      of{" "}
      <strong>
        {totalArea} {displayUnit}
=======
        {totalAreaProtected} {unitRestorationPotential}
      </strong>{" "}
      of{" "}
      <strong>
        {totalArea} {unitRestorationPotential}
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
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

<<<<<<< HEAD
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
=======
  const restorationPotentialValue = (
    <>
      The restoration of mangroves in <strong>{location}</strong> would increase the value of the following ecosystem services:
    </>
  );
  
  const trianglePosition = ((lineChartWidth * restorationPotentialScore) / 100) - 7; // substract icon size

  if (!restorationData.restoration_potential_score) return null;

  return (
    <ChartWidget
      name={name}
      slug={slug}
      filename={slug}
      chart={false}
      isCollapsed={isCollapsed}
      {...props}
      >
        <div className={widgetStyles.restorationChartWrapper}>
          <div className={widgetStyles.subtitle}>overview</div>
          <div className={styles.restorationPotentialSentence} key={Date.now()}>
            {restorationPotentialLineSentence}
          </div>
          <div>
          <span className={widgetStyles.restorationPotentialUnit}>{unitRestorationPotential}</span>
          <WidgetLegend groups={{ MANGROVE_RESTORATION_POTENTIAL_CHART_LABELS }} type="height" />
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
          </div>
            
            <div ref={lineChartRef} className={widgetStyles.lineChartWidget}>
            <Icon
              name="play"
              className={widgetStyles.lineChartIcon}
<<<<<<< HEAD
              style={{ left: trianglePosition }}
=======
              style={{ left: !!trianglePosition && trianglePosition }}
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
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
<<<<<<< HEAD
            className={""}
=======
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
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
<<<<<<< HEAD
=======
          <div className={widgetStyles.subtitle}>Mangrove degradation and loss</div>
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialTreeMapSentence}
          </div>

          <div className={widgetStyles.treemap}>
<<<<<<< HEAD
          <WidgetLegend groups={{ labels }} type="height" />
=======
          <WidgetLegend groups={chartTreeConfig.legend} type="blue-carbon" unit="ha" classname="maxWidth" />
          <div className={widgetStyles.treemapChart}>
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363

            <Chart
              className={widgetStyles.breakLine}
              {...props}
              name={name}
              slug={slug}
              filename={slug}
              isCollapsed={isCollapsed}
              sentence={restorationPotentialTreeMapSentence}
<<<<<<< HEAD
              data={chartTreeData}
              config={chartTreeConfig}
              chartData={widgetDataTree}
            />
          </div>
          {component}
=======
              data={degradationAndLossData}
              config={chartTreeConfig}
              chartData={widgetDataTree}
              />
              </div>
          </div>
        <hr className={widgetStyles.breakLine} />
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
        </div>

        <div className={widgetStyles.restorationChartWrapper}>
        <div className={widgetStyles.subtitle}>mangrove restoration value</div>
<<<<<<< HEAD

          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialRingSentence}
          </div>
          <Chart
            className={""}
=======
          <div className={styles.sentence} key={Date.now()}>
            {restorationPotentialValue}
          </div>
          <Chart
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
            {...props}
            name={name}
            slug={slug}
            filename={slug}
            isCollapsed={isCollapsed}
<<<<<<< HEAD
            sentence={restorationPotentialRingSentence}
            data={chartRingData}
            config={chartRingConfig}
            chartData={widgetDataRing}
          />

          <hr className={widgetStyles.breakLine} />
        </div>
      </Widget>
    </div>
=======
            sentence={restorationPotentialValue}
            data={chartValueData}
            config={chartValueConfig}
            chartData={widgetDataValue}
          />

        </div>
      </ChartWidget>
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
  );
}

MangroveRestoration.propTypes = {
<<<<<<< HEAD
  data: PropTypes.shape({}),
=======
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
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
<<<<<<< HEAD
  data: null,
=======
>>>>>>> 25697e8dbf72d99a9484bee079cf82d30c928363
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
