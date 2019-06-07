import React from 'react';
import PropTypes from 'prop-types';

import Widget from 'components/widget';

const MockedChart = () => (
  <div>
    <h3>Just a mocked chart!</h3>
  </div>
);

const WidgetList = ({ list }) => (
  <div>
    { list.map(({ id, title }) => (
      <Widget
        key={id}
        id={id}
        title={title}
        chart={MockedChart}
      />
    )) }
  </div>
);

WidgetList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired
};

export default WidgetList;
