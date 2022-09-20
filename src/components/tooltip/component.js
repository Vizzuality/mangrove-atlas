import React from 'react';

import Tippy from 'tippy.js/headless';

const Tooltip = ({
  content,
  children,
  ...props
}) => (
  <Tippy
    {...props}
    interactive
    render={() => content}
  >

    {children}
  </Tippy>
);

export default Tooltip;