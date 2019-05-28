import React from 'react';
import PropTypes from 'prop-types';

const Widgets = ({ list }) => (
  <div>
    { list.map(widget => (
      <h2 key={widget.id}>{widget.title}</h2>
    )) }
  </div>
);

Widgets.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Widgets;
