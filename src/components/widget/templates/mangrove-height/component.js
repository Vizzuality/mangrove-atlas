import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'components/select';
import Chart from 'components/chart';
import styles from 'components/widget/style.module.scss';

const MangroveHeight = ({ widgetConfig }) => {
  const [startDate, setStartDate] = useState('1996');
  const [endDate, setEndDate] = useState('2010');
  const data = widgetConfig.parse();
  const { chartConfig, metadata, chartData } = data;

  const dateOptions = metadata.map(year => ({
    label: year.toString(),
    value: year.toString()
  }));

  const unit = 'ha';

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
        Over the past 20 years, mangroves in the world have <strong>decreased</strong> by
        <strong> x {unit}</strong> between {startDateSelector} and {endDateSelector}.
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
