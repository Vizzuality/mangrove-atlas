import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import ChartWidget from 'components/chart-widget';

import { getCurrentLocation } from 'modules/pages/sagas';

import config from './config';
import { getLocationType } from '../../modules/pages/sagas';

const fakeData = {
  data: {
      pledge_type: 'a GHG target',
      base_years: 2005,
      target_years: [2025, 2030],
      ndc_target: {
          values: [220, 480],
          unit: "mtCO2e/yr"
      },
      ndc_target_url: 'https://www4.unfccc.int/sites/NDCStaging/pages/Party.aspx?party=BRA',
      ndc_reduction_target: {
          values  : [37, 50],
          unit: '%'
      },
      ndc_blurb: "Brazil intends to commit to reduce greenhouse gas emissions by 37% below 2005 levels in 2025.",
      ndc_updated: false,
      ndc: false,
      ndc_mitigation: false,
      ndc_adaptation: false
  },
  metadata: {
      location_id: 1_2_74,
  },
};

export const MangroveInternationalStatus = ({
  // data,
  currentLocation,
  isCollapsed = true,
  slug,
  fetchMangroveInternationalStatusData,
  locationsList,
  current,
  type,
  ...props
}) => {
  const { id } = currentLocation;

  const { data } = fakeData;

  const locationType = getLocationType(type);
  const location = getCurrentLocation(locationsList, current, locationType);
  useEffect(() => {
    if (current !== 'worldwide' || current !== 1561) {
      fetchMangroveInternationalStatusData({ ...id && { location_id: id } });
    }
  }, [id, current, fetchMangroveInternationalStatusData]);
  
  const { reductionTarget, ndcTarget } = config.parse(data);

  const { pledge_type, ndc_target, ndc_reduction_target, base_years, target_years } = fakeData.data;

  const widgetData = {
    data: fakeData.data,
    config: null
  };

  return (
    <ChartWidget
      slug={slug}
      filename={slug}
      chart={false}
      data={widgetData}
      isCollapsed={isCollapsed}
      {...props}
      >
        <div slug={slug}>
          {pledge_type &&(
          <div>
            <h3>Nationally determined contributions (NDC)</h3>
            <p>{location.name}'s NDC pledge contains {pledge_type}</p>
          </div>
          )}
        <div>
          <h3>Forest Reference Emission Levels</h3>
          <p>The GHG target {!ndc_reduction_target.values.length && !!ndc_target.values.length && `represents a reduction of ${ndcTarget}${ndc_target.values.unit}`} is a {reductionTarget}{ndc_reduction_target.unit} reduction {!!base_years.length && `from a baseline in ${base_years}`} {!!target_years.lentgh && `by target year ${target_years}`}.{!!ndc_target.values.length && `This represents a reduction of ${ndcTarget}${ndc_target.unit}.`}</p>
        </div>
      </div>
    </ChartWidget>
  )
}

MangroveInternationalStatus.propTypes = {
  data: PropTypes.shape({}),
  currentLocation: PropTypes.shape({})
};

MangroveInternationalStatus.defaultProps = {
  data: null,
  currentLocation: null
};

export default MangroveInternationalStatus;
