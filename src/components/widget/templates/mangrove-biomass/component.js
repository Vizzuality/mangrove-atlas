import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'components/select';
import Chart from 'components/chart';
import styles from 'components/widget/style.module.scss';

const MangroveBiomass = ({ widgetConfig, currentLocation }) => {
  const [startDate, setStartDate] = useState('1996');
  const [endDate, setEndDate] = useState('2010');
  const data = widgetConfig.parse();
  const { chartConfig, metadata, chartData } = data;

  const dateOptions = metadata.map(year => ({
    label: year.toString(),
    value: year.toString()
  }));

  const startDateSelector = (
    <Select
      value={startDate}
      options={dateOptions}
      onChange={value => setStartDate(value)}
    />
  );

  const location = (currentLocation.location_type === 'worldwide')
    ? 'the world’s'
    : <span className="notranslate">{`${currentLocation.name}'s`}</span>;

  const endDateSelector = (
    <Select
      value={endDate}
      options={dateOptions}
      onChange={value => setEndDate(value)}
    />
  );

  return (
    <div className={styles.widget_template}>
      <div className={styles.sentence}>
        Mean mangrove above-ground biomass density (mg ha-1) in {location} was
          ***average([agb_mangrove_mgha-1])*** between {startDateSelector} and {endDateSelector}.
        <Chart
          data={chartData}
          config={chartConfig}
        />
      </div>
    </div>
  );
};

MangroveBiomass.propTypes = {
  widgetConfig: PropTypes.shape({}).isRequired,
  currentLocation: PropTypes.shape({})
};

MangroveBiomass.defaultProps = {
  currentLocation: null
};

export default MangroveBiomass;
