import React from 'react';

import style from './style.module.scss';

const MapControls = ({ children }) => {
  return (
    <div className={style.controls}>
      {children}
    </div>
  )
};

export default MapControls;
