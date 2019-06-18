import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';
import TEMPLATES from 'components/widget/templates';
import CONFIGS from 'components/widget/templates/configs';

const Widgets = ({ list }) => (
  <Fragment>
    { list.map(widget => (
      <Widget
        key={widget.id}
        widgetConfig={CONFIGS[widget.slug]}
        {...widget}
      >
        {({ slug, data, ...props }) => (
          <Fragment>
            {/* Template */}
            {!!TEMPLATES[widget.slug] && React.createElement(TEMPLATES[widget.slug], {
              ...data,
              ...props
            })}
          </Fragment>
        )}
      </Widget>
    )) }
  </Fragment>
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
