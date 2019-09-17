import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'components/select';
import Chart from 'components/chart';
import styles from 'components/widget/style.module.scss';

const MangroveHeight = ({ widgetConfig, currentLocation }) => {
  const [startDate, setStartDate] = useState('1996');
  const [endDate, setEndDate] = useState('2010');
  const [area, setAreaType] = useState('basal');
  const data = widgetConfig.parse();
  const { chartConfig, metadata, chartData } = data;
  const location = currentLocation.name;

  const areaOptions = [
    { label: 'basal', value: 'basal' },
    { label: 'canopy', value: 'canopy'}
  ];

  const dateOptions = metadata.map(year => ({
    label: year.toString(),
    value: year.toString()
  }));

  const areaSelector = (
    <Select
      value={area}
      options={areaOptions}
      onChange={value => setAreaType(value)}
    />
  );

  const startDateSelector = (
    <Select
      value={startDate}
      options={dateOptions}
      onChange={value => setStartDate(value)}
    />
  );

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
        Mean mangrove {areaSelector} height (m) in {location} was ***average([hmax_mangrove_m] OR average([hba_mangrove_m] )*** between {startDateSelector} and {endDateSelector}.
        <Chart
          data={chartData}
          config={chartConfig}
        />
      </div>
    </div>
  );
};

MangroveHeight.propTypes = {
  widgetConfig: PropTypes.shape({}).isRequired
};

export default MangroveHeight;
