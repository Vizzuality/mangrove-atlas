import React from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';

const propertiesNameMap = new Map([
  ['Precip_Cha', 'Precipitation Change'],
  ['Temp_Chang', 'Temperature Change'],
  ['Storm_Freq', 'Storm Frequency'],
  ['Drought_Pr', 'Drought Probability'],
  ['CorePer', 'Mangrove Core'],
  ['Gain', 'Mangrove Gain'],
  ['Loss', 'Mangrove Loss'],
  // ['', 'Observed Biomass'],
  ['Mudflat_Av', 'Mudflat availability']
]);

const MapPopUpHotspots = ({
  Country: country,
  Precip_Cha: precipitationChange,
  Temp_Chang: temperatureChange,
  Storm_Freq: stormFrequency,
  Drought_Pr: droughtProbability,
  CorePer: mangroveCore,
  Final_Chan: finalChange,
  Mudflat_Av: mudflatAvailability
}) => {
  const features = [
    { id: 'Precip_Cha', value: precipitationChange },
    { id: 'Temp_Chang', value: temperatureChange },
    { id: 'Storm_Freq', value: stormFrequency },
    { id: 'Drought_Pr', value: droughtProbability },
    { id: 'CorePer', value: mangroveCore },
    { id: 'Gain', value: (finalChange >= 0) ? finalChange : null },
    { id: 'Loss', value: (finalChange < 0) ? Math.abs(finalChange) : null },
    { id: 'Mudflat_Av', value: mudflatAvailability },
  ].filter(feat => feat.value !== null);

  return (
    <div className={style.mapPopupHotspots}>
      <div className={style.title}>
        {`Mangrove Hotspots - ${country}`}
      </div>
      <div className={style.content}>
        <ul>
          { features.map(feature => (
            <li className={style.feature} key={feature.id}>
              <div className={style.name}>{propertiesNameMap.get(feature.id)}:</div>
              <div className={style.value}>{feature.value}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

MapPopUpHotspots.propTypes = {
  Country: PropTypes.shape({}),
  Precip_Cha: PropTypes.shape({}),
  Temp_Chang: PropTypes.shape({}),
  Storm_Freq: PropTypes.shape({}),
  Drought_Pr: PropTypes.shape({}),
  CorePer: PropTypes.shape({}),
  Final_Chan: PropTypes.shape({}),
  Mudflat_Av: PropTypes.shape({})
};

MapPopUpHotspots.defaultProps = {
  Country: null,
  Precip_Cha: null,
  Temp_Chang: null,
  Storm_Freq: null,
  Drought_Pr: null,
  CorePer: null,
  Final_Chan: null,
  Mudflat_Av: null
};

export default MapPopUpHotspots;
