import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import ChartWidget from 'components/chart-widget';

import { getCurrentLocation, getLocationType } from 'modules/pages/sagas';

const fakeData = {
  data: {
      pledge_type: 'a GHG target',
      base_years: '2005',
      target_years: '2025 and 2030',
      ndc_target: '220 and 480 mtCO2e/yr',
      ndc_target_url: 'https://www4.unfccc.int/sites/NDCStaging/pages/Party.aspx?party=BRA',
      ndc_reduction_target: '37 and 50%',
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
  name,
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
  
  const { pledge_type, ndc_target, ndc_reduction_target, base_years, target_years, ndc_target_url } = data;

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
          {pledge_type &&(
          <div>
            <h3>Nationally determined contributions (NDC)</h3>
            <p>{location?.name}'s NDC pledge contains {pledge_type}</p>
          </div>
          )}
        <div>
          <h3>Forest Reference Emission Levels</h3>
          <p>The GHG target {' '}
            {!ndc_reduction_target && !!ndc_target && 'represents a reduction of' && <a href={ndc_target_url} alt="ndc target">{ndc_target}</a>}
            {' '} is a {' '}{ndc_reduction_target} reduction {!!base_years && `from a baseline in ${base_years}`} {!!target_years && `by target year ${target_years}`}.{!!ndc_target && `This represents a reduction of ${ndc_target}.`}</p>
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
