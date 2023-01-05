import React, {
  createRef,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
} from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";

// components
import ChartWidget from "components/chart-widget";
import Chart from "components/chart";
import Icon from "components/icon";
import WidgetLegend from "components/widget-legend";

import styles from "components/widget/style.module.scss";
import widgetStyles from "widget-components/mangrove-restoration/style.module.scss";

import config from "./config";

import { MANGROVE_RESTORATION_POTENTIAL_CHART_LABELS } from "./constants";

const numberFormat = format(",.2f");

function MangroveRestoration({
  component,
  isCollapsed = true,
  slug,
  name,
  addFilter,
  ui: { restoration: uiRestoration, degradationAndLoss: uiDegradationAndLoss },
  fetchMangroveRestorationData,
  fetchMangroveDegradationAndLossData,
  fetchMangroveEcosystemServicesData,
  restorationData,
  restorationDataMetadata,
  degradationAndLossData,
  degradationAndLossMetadata,
  ecosystemServicesData,
  ecosystemServicesMetadata,
  isLoading,
  isLoadingRestorationData,
  isLoadingDegradationAndLossData,
  setUi,
  currentLocation,
  ...props
}) {
  const ref = createRef();
  const yearRestoration = useMemo(
    () =>
      uiRestoration?.year ||
      restorationDataMetadata?.year[restorationDataMetadata.year.length - 1],
    [uiRestoration, restorationDataMetadata]
  );
  const unit = useMemo(() => uiRestoration?.unit, [uiRestoration]);
  const yearDegradationAndLoss = useMemo(
    () =>
      uiDegradationAndLoss?.year ||
      degradationAndLossMetadata?.year[
        degradationAndLossMetadata.year.length - 1
      ],
    [uiDegradationAndLoss, degradationAndLossMetadata]
  );

  const [lineChartWidth, setLineChartWidth] = useState(0);

  // fires synchronously after all DOM mutations.
  useLayoutEffect(() => {
    setLineChartWidth(ref?.current?.offsetWidth);
  }, [ref]);

  useEffect(() => {
    fetchMangroveRestorationData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
    fetchMangroveDegradationAndLossData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });
    fetchMangroveEcosystemServicesData({
      ...(currentLocation?.iso?.toLowerCase() !== "worldwide" && {
        location_id: currentLocation.id,
      }),
    });

    if (!isLoadingRestorationData) {
      addFilter({
        filter: {
          id: "restoration",
          year: yearRestoration,
          unit,
        },
      });
      setUi({ id: "restoration", value: { year: yearRestoration } });
    }
    if (!isLoadingDegradationAndLossData) {
      addFilter({
        filter: {
          id: "degradation_and_loss",
          year: yearDegradationAndLoss,
          unit,
        },
      });
      setUi({
        id: "degradation_and_loss",
        value: { year: yearDegradationAndLoss },
      });
    }
  }, [
    // eslint-disable-line
    addFilter,
    unit,
    yearRestoration,
    yearDegradationAndLoss,
    fetchMangroveRestorationData,
    fetchMangroveDegradationAndLossData,
    fetchMangroveEcosystemServicesData,
    currentLocation
  ]);

  const unitRestorationPotential = useMemo(
    () =>
      !isLoading && restorationDataMetadata?.units?.restoration_potential_score,
    [isLoading, restorationDataMetadata]
  );

  const restorationPotentialScore =
    !isLoading && restorationData?.restoration_potential_score;
  const { units: restorationUnits } =
    !!restorationDataMetadata && restorationDataMetadata;
  const {
    chartRingData,
    chartRingConfig,
    chartValueData,
    chartValueConfig,
    chartTreeConfig,
  } = config.parse(
    restorationData,
    restorationUnits,
    degradationAndLossData,
    ecosystemServicesData,
    ecosystemServicesMetadata,
    yearRestoration,
    unitRestorationPotential
  );

  if (!restorationData) {
    return null;
  }

  const location =
    currentLocation?.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{`${currentLocation.name}`}</span>
    );
  const restorableAreaPerc = numberFormat(restorationData.restorable_area_perc);

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

  const lossDriver =
    degradationAndLossMetadata?.main_loss_driver
    || "Commodities";

  // charts sentences
  const restorationPotentialLineSentence = (
    <>
      The mean restoration potential score for
      <strong>
        &nbsp;{location} is {restorationPotentialScore}%
      </strong>
    </>
  );

  const restorationPotentialRingSentence = (
    <>
      <strong>
        { currentLocation?.location_type === "worldwide" ? (
      "the world"
    ) : (
      <span className="notranslate">{`${currentLocation.name}`}</span>
    )}
        's&nbsp;
      </strong>{" "}
      restorable mangrove areas represent <strong>{restorableAreaPerc}%</strong>{" "}
      of the total mangrove area.
    </>
  );

  const restorationPotentialTreeMapSentence = (
    <>
      The main mangrove loss driver in <strong>{location}</strong> is{" "}
      <strong>{lossDriver === 'Commodities' ? `${lossDriver} (rice, shrimp, and oil palm cultivation)}` : lossDriver}</strong> 
    </>
  );

  const restorationPotentialValue = (
    <>
      The restoration of mangroves in <strong>{location}</strong> would increase
      the value of the following ecosystem services:
    </>
  );

  const trianglePosition =
    (lineChartWidth * restorationPotentialScore) / 100 - 7; // substract icon size

  if (!restorationData.restoration_potential_score) return null;

  return (
    <ChartWidget
      name={name}
      slug={slug}
      filename={slug}
      chart={false}
      isCollapsed={isCollapsed}
      {...props}
      component={
        <>
          <div className={widgetStyles.restorationChartWrapper}>
            <div className={widgetStyles.subtitle}>overview</div>
            <div className={widgetStyles.sentence} key={Date.now()}>
              {restorationPotentialLineSentence}
            </div>
            <div>
              <span className={widgetStyles.restorationPotentialUnit}>
                {unitRestorationPotential}
              </span>
              <WidgetLegend
                groups={{ MANGROVE_RESTORATION_POTENTIAL_CHART_LABELS }}
                type="height"
              />
            </div>

            <div ref={ref} className={widgetStyles.lineChartWidget}>
              <Icon
                name="play"
                className={widgetStyles.lineChartIcon}
                style={{ left: !!trianglePosition && trianglePosition }}
              />
            </div>
            <hr className={widgetStyles.breakLineDashed} />
          </div>

          <div className={widgetStyles.restorationChartWrapper}>
            <div className={widgetStyles.subtitle}>
              Restorable Mangrove Area
            </div>
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
            <div className={widgetStyles.subtitle}>Mangrove Loss</div>
            <div className={styles.sentence} key={Date.now()}>
              {restorationPotentialTreeMapSentence}
            </div>

            <div className={widgetStyles.treemap}>
              <WidgetLegend
                groups={chartTreeConfig.legend}
                type="blue-carbon"
                unit="ha"
                classname="maxWidth"
              />
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
            <hr className={widgetStyles.breakLine} />
          </div>

          <div className={widgetStyles.restorationChartWrapper}>
            <div className={widgetStyles.subtitle}>
              mangrove restoration value
            </div>
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
          </div>
        </>
      }
    />
  );
}

MangroveRestoration.propTypes = {
  currentLocation: PropTypes.shape({}),
  addFilter: PropTypes.func,
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  metadata: PropTypes.shape({}),
  ui: PropTypes.shape({
    year: PropTypes.number,
    unit: PropTypes.string,
  }),
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
