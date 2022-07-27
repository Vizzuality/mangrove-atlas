import React from 'react';
import PropTypes from 'prop-types';

import { Tippy, Tooltip } from 'react-tippy';

const Tooltip2 = ({ content, children }) => (
	<Tippy render={() => content}>
    {children}
  </Tippy>
	// <div>tooltip</div>
);

Tooltip.propTypes = {
  content: PropTypes.node.isRequired,
	children: PropTypes.node.isRequired,
};

export default Tooltip2;
