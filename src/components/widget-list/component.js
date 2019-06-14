import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';

// todo: move this to widget selectors
// it make sense to have the chart type as part of configuration
const MockedChart = () => (
  <div>
    <h3>Just a mocked chart!</h3>
  </div>
);

const WidgetList = ({ list }) => (
  <Fragment>
    { list.map(widget => (
      <Widget
        key={widget.id}
        {...widget}
        chart={MockedChart}
      />
    )) }
  </Fragment>
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
