import React from 'react';

// utils
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import chroma from 'chroma-js';

// components
import WidgetTooltip from 'components/widget-tooltip';
import WidgetLegend from 'components/widget-legend';

const numberFormat = format(',.2f');

const getChartRingData = (data, restorationDataMetadata, year) => {
  if (!data) return null;
  const { restorable_area: restorableAreaUnit, mangrove_area: mangroveAreaUnit } = restorationDataMetadata;
  const protectedMangroves = data.restorable_area;
  const nonProtected = data.total_area - protectedMangroves;
  const protectedPercentage = data.restorable_area_perc;
  const nonProtectedPercentage = 100 - protectedPercentage;

  return ([
    {
      label: 'Total restorable area',
      shortLabel: 'Total restorable area',
      value: 'protection',
      color: '#7996F3',
      percentage: protectedPercentage,
      total: data.total,
      year,
      unit: restorableAreaUnit,
      protection: protectedMangroves,
      area: data.restorable_area
    },
    {
      label: `Total non-restorable area in ${year}`,
      shortLabel: 'Total non-restorable area',
      value: 'nonProtected',
      color: '#ECECEF',
      total: data.total,
      percentage: nonProtectedPercentage,
      protection: nonProtected,
      year,
      unit: mangroveAreaUnit,
      area: data.mangrove_area_extent
    }])
};

const getChartValueData = (data) => {
  if (!data.length) return [];

  const total = data.reduce((a, b) => (a.value + b.value));

  const dataConstants = {
    label: {
      AGB: 'Aboveground Carbon',
      SOC: 'Soil Organic Carbon',
    },
    color: {
      AGB: '#7996F3',
      SOC: '#ECECEF'
    },
  };

  return data.map(d => ({
    label: dataConstants.label[d.indicator],
    color: dataConstants.color[d.indicator],
    total, 
    value: 'indicator',
    percentage: (d.value * 100) / total,
    indicator: d.value,
    name: dataConstants.label[d.indicator],
  }))
};

const CustomizedContent = (props) => {
  const { depth, x, y, width, height, data, color } = props;
  if (!data) return null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill:
            depth < 2
              ? color
              : "none",
          stroke: "white",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10)
        }}
      />
    </g>
  );
};

const getLossData = (data) => {
  const lossData = data.filter(({ indicator }) => indicator !== 'degraded_area')
  const indicators = lossData?.map((d) => d.indicator);
  const colorsScale = chroma.scale(["#7996F3", "#EB6240", "#A6CB10"]).colors(indicators.length);
  const colors = indicators.reduce((acc, indicator, index) => ({
    ...acc,
    [indicator]: colorsScale[index],
  }), {});
  return lossData.map((d) => ({
    ...d,
    color: colors[d.indicator]
  }))
}

export const CONFIG = {
  parse: (data, restorationDataMetadata, degradationAndLossData, ecosystemServicesData, ecosystemServicesMetadata, year, unitRestorationPotential) => {
    const chartRingData = getChartRingData(data, restorationDataMetadata, year);
    const chartValueData = getChartValueData(ecosystemServicesData);
    const LossDataWidthColors = getLossData(degradationAndLossData);
    const ecosystemServicesUnit = ecosystemServicesMetadata?.unit;
    return {
      chartRingData,
      chartValueData,
      chartRingConfig: {
        type: 'pie',
        layout: 'centric',
        height: 250,
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'nonProtected',
        yKeys: {
          pies: {
            protection: {
              cx: '50%',
              cy: '50%',
              paddingAngle: 2,
              dataKey: 'percentage',
              nameKey: 'label',
              innerRadius: '55%',
              outerRadius: '80%',
              isAnimationActive: false,
            }
          }
        },
        legend: {
          align: 'left',
          verticalAlign: 'middle',
          maxWidth: 150,
          layout: 'vertical',
          fontSize: 9,
          content: (properties) => {
            
            const { payload } = properties;
            const groups = groupBy(payload.map((item) => {
              const value =  item.payload.area
              return {
                ...item,
                payload: {
                  ...item.payload,
                  y: value,
                }
              };
            }), p => p.payload.label);
            return (
              <WidgetLegend 
                widgetSpecific="blue-carbon"
                groups={groups} unit={'ha'}
                classname="minWidth"
              />
            );
          }
        },
        tooltip: {
          cursor: false,
          content: ((properties) => {
            const { payload } = properties;
            if (!payload.length) return null;
            const { payload: values } = payload[0];
            const { unit } = values;
            return (
              <WidgetTooltip
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '10px',
                }}
                payload={payload} 
                settings={[
                  { key: 'shortLabel' },
                  { label: 'Area', key: 'area', format: (value) => `${numberFormat(value)} ${unit}`, position: '_column' },
                  { label: 'Percentage', key: 'percentage', format: value => `${numberFormat(value)} %`, position: '_column' },
                ]}
              />
            );
          })
        }
      },
      chartTreeConfig: {
        width: 175,
        height: 175,    
        name: 'indicator',
        data: LossDataWidthColors,
        dataKey: "value",
        yKeys: { tree: true },
        tooltip: {
          cursor: false,
          content: (
            <WidgetTooltip
              settings={[
                { label: 'Restoration potential Score', color: '#06C4BD', key: 'restorable_area_perc', format: value => `${value} %` },
                { label: 'Total', color: '#ECECEF', key: 'area', format: value => `${numberFormat(Math.abs(value))} ha` },
              ]}
              style={{
                flexDirection: 'column',
                marginTop: '10px',
                marginLeft: '-50px'
              }}
            />
          )
        },
        content: <CustomizedContent data={LossDataWidthColors} />,
        legend: LossDataWidthColors?.reduce((acc, indicator) => ({
          ...acc,
          [indicator.indicator]: [{
            color: indicator.color,
            type: "rect",
            key: indicator.indicator,
            payload: { y: indicator.value },
            [indicator.indicator]: indicator.indicator,
            value: indicator.indicator.replace('_', ' '),
          }]
        }), {})
      },
      chartValueConfig: {
        type: 'pie',
        layout: 'centric',
        height: 250,
        margin: { top: 20, right: 0, left: 0, bottom: 0 },
        xKey: 'indicator',
        yKeys: {
          pies: {
            indicator: {
              cx: '50%',
              cy: '50%',
              paddingAngle: 2,
              dataKey: 'percentage',
              nameKey: 'indicator',
              innerRadius: '55%',
              outerRadius: '80%',
              isAnimationActive: false,
            }
          }
        },
        legend: {
          align: 'left',
          verticalAlign: 'middle',
          maxWidth: 150,
          layout: 'vertical',
          fontSize: 9,
          content: (properties) => {
            
            const { payload } = properties;
            
            const groups = groupBy(payload.map((item) => {
              const value =  item.payload.indicator
              return {
                ...item,
                payload: {
                  ...item.payload,
                  y: value,
                }
              };
            }), p => p.payload.name);

            return (
              <WidgetLegend
                widgetSpecific="blue-carbon"
                groups={groups}
                unit={ecosystemServicesUnit}
                classname="minWidth"
                />
            );
          }
        },
        tooltip: {
          cursor: false,
          content: ((properties) => {
            const { payload } = properties;
            if (!payload.length) return null;
            return (
              <WidgetTooltip
                style={{
                  flexDirection: 'column',
                  marginTop: '10px',

                }}
                payload={payload}
                settings={[
                  { key: 'label' },
                  { label: 'Total', key: 'indicator', format: (value) => `${numberFormat(value)} ${ecosystemServicesUnit}`, position: '_column' },
                  { label: 'Percentage', key: 'percentage', format: value => `${numberFormat(value)} %`, position: '_column' },
                ]}
              />
            );
          })
        }
      },
    };
  }
};

export default CONFIG;
