import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import RestorationInfo from './sections/restoration-info';
import RestorationDetailsInfo from './sections/restoration-details-info';
import EcosystemServicesInfo from './sections/ecosystem-services-info';

import style from './style.module.scss';

const MapPopUpRestoration = ({ data }) => {
  const [open, setOpen] = useState();
  const handleClick = useCallback(
    (id) => {
      if (!open || id !== open) {
        setOpen(id);
      } else setOpen();
    },
    [open],
  );

  return (
    <div className={style.popupWrapper}>
      <RestorationInfo
        data={data}
        isOpen={open === 'restoration'}
        handleClick={() => handleClick('restoration')}
      />
      <RestorationDetailsInfo
        data={data}
        isOpen={open === 'details'}
        handleClick={() => handleClick('details')}
      />
      <EcosystemServicesInfo
        data={data}
        isOpen={open === 'ecosystem'}
        handleClick={() => handleClick('ecosystem')}
      />
    </div>
  );
};

MapPopUpRestoration.propTypes = {
  data: PropTypes.shape({}),
};

MapPopUpRestoration.defaultProps = { data: {} };

export default MapPopUpRestoration;
