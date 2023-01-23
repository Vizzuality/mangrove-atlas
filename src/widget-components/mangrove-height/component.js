import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

// components
import Select from 'components/select';
import ChartWidget from 'components/chart-widget';
import WidgetDrawingToolControls from 'widget-components/mangrove-drawing-tool/widget-drawing-tool-controls';

// utils
import { format } from 'd3-format';

import config from './config';

const numberFormat = format(',.2f');

const MangroveHeight = ({
  data,
  isLoading,
  metadata,
  isCollapsed = true,
  slug,
  name,
  currentLocation,
  addFilter,
  ui,
  setUi,
  drawingValue,
  drawingMode,
  customGeojsonFeatures,
  fetchMangroveHeightData,
  ...props
}) => {
  const [restart, setRestart] = useState(null);
  const { year } = ui;
  const heightCoverage = metadata?.avg_height[0]?.value;
  const years = metadata?.year;
  const currentYear = useMemo(() => year || years?.[0], [year, years]);
  const customArea = useMemo(() => !!drawingValue?.length || !isEmpty(customGeojsonFeatures), [drawingValue, customGeojsonFeatures]);

  useEffect(() => {
    fetchMangroveHeightData(
      currentLocation?.id !== 'custom-area' || drawingMode
        ? {
          ...(currentLocation?.iso?.toLowerCase() !== 'worldwide' && {
            location_id: currentLocation.id,
          }),
        }
        : {
          drawingValue,
          slug: ['mangrove_height'],
          location_id: 'custom-area',
        },
    );
  }, [currentLocation, fetchMangroveHeightData, drawingValue, drawingMode]);

  useEffect(() => {
    addFilter({
      filter: {
        id: 'height',
        year: currentYear,
      },
    });
    if (!isLoading) {
      setTimeout(() => {
        setUi({ id: 'height', value: { year: currentYear } });
      }, 0);
    }
  }, [setUi, currentYear, addFilter, isLoading]);

  const dateHandler = useCallback(
    (value) => {
      setUi({ id: 'height', value: { year: value } });
      addFilter({
        filter: {
          id: 'height',
          year: value,
        },
      });
    },
    [addFilter, setUi],
  );

  const location = useMemo(() => {
    if (customArea) return 'the area selected';
    if (currentLocation?.location_type === 'worldwide') return 'the world';
    return <span className="notranslate">{currentLocation.name}</span>;
  }, [currentLocation, customArea]);

  const dateOptions = useMemo(
    () => years?.map((year) => ({
      label: year.toString(),
      value: year,
    })),
    [years],
  );

  const loadingAnalysis = useMemo(
    () => (isLoading && drawingMode) || restart,
    [isLoading, drawingMode, restart],
  );

  if (!data || !data.length) {
    return null;
  }

  const { chartData, chartConfig, downloadData } = config.parse(
    data,
    year,
    years,
    heightCoverage,
  );

  const dateDisplay = dateOptions?.length > 1 ? (
    <Select
      value={year}
      options={dateOptions}
      onChange={(value) => dateHandler(value)}
    />
  ) : (
    year
  );

  const sentence = (
    <>
      Mean mangrove
      {' '}
      <strong>maximum</strong>
      {' '}
      canopy height in
      {' '}
      <strong>{location}</strong>
      {' '}
      was
      <strong>
        {' '}
        {numberFormat(heightCoverage)}
        {' '}
        m
      </strong>
      {' '}
      in
      {' '}
      <strong>{dateDisplay}</strong>
      .
    </>
  );
  const widgetData = {
    data: chartData,
    config: chartConfig,
  };

  if (!chartData || !chartData.length) {
    return null;
  }
  return (
    <ChartWidget
      name={name}
      data={chartData}
      slug={slug}
      filename={slug}
      isCollapsed={loadingAnalysis ? false : isCollapsed}
      downloadData={downloadData}
      sentence={loadingAnalysis ? null : sentence}
      chartData={widgetData}
      chart={!loadingAnalysis}
      {...props}
      component={drawingMode && (
        <WidgetDrawingToolControls
          slug="mangrove_height"
          fetch={fetchMangroveHeightData}
          drawingValue={drawingValue}
          isLoading={isLoading}
          restart={restart}
          setRestart={setRestart}
        />
      )}
    />
  );
};

MangroveHeight.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  isLoading: PropTypes.bool,
  metadata: PropTypes.shape({
    avg_height: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.number,
        value: PropTypes.number,
      }),
    ),
    location_id: PropTypes.string,
    note: PropTypes.string,
    units: PropTypes.shape({}),
    year: PropTypes.arrayOf(PropTypes.number),
  }),
  isCollapsed: PropTypes.bool,
  slug: PropTypes.string,
  name: PropTypes.string,
  currentLocation: PropTypes.shape({}),
  ui: PropTypes.shape({
    year: PropTypes.number,
    unit: PropTypes.string,
  }),
  addFilter: PropTypes.func,
  setUi: PropTypes.func,
  fetchMangroveHeightData: PropTypes.func,
};

MangroveHeight.defaultProps = {
  data: null,
  isLoading: true,
  metadata: null,
  isCollapsed: false,
  slug: null,
  name: null,
  currentLocation: null,
  ui: null,
  addFilter: () => {},
  setUi: () => {},
  fetchMangroveHeightData: () => {},
};

export default MangroveHeight;
