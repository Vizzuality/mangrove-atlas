import React from 'react';
import isEmpty from 'lodash/isEmpty';

const LABELS = {
  "nationally_determined_contributions": "Nationally determined contributions (NDC)",
  "forest_reference_emissions_levels": "Forest Reference Emission Levels",
  "ipcc_wetlands_supplement": "IPCC Wetlands Supplement"
};

export const CONFIG = {
  parse: (data) => {
    if(isEmpty(data)) return null;
    // const widgetData = data?.map(
    //   ({ indicator, value}) => ({
    //     indicator: LABELS[indicator],
    //     value,
    //   })
    // );
 const { ndc_target, ndc_reduction_target } = data;

    const reductionTarget = ndc_reduction_target.values.map((target, i) => {
      return <span>{target}{i < target.lentgh - 2 && ','}{i === target.lentgh - 1 && 'and'}</span>
    })
    
    const ndcTarget = ndc_target.values.map((target, i) => {
      return <span>{target}{i < target.lentgh - 2 && ','}{i === target.lentgh - 1 && 'and'}</span>
    })
    return {
      reductionTarget,
      ndcTarget
    }
  }
};

export default CONFIG;
