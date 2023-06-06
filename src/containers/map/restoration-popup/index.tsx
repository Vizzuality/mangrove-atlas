import { useCallback, useState } from 'react';

import { Popup } from 'react-map-gl';

import Details from 'containers/map/restoration-popup/sections/details';
import EcosystemServices from 'containers/map/restoration-popup/sections/ecosysyem-services';
import RestorationScores from 'containers/map/restoration-popup/sections/restoration-scores';

import type { RestorationPopUp } from 'types/map';

const PopupRestoration = ({
  restorationPopUpInfo,
}: {
  restorationPopUpInfo: {
    popup: number[];
    popupInfo: RestorationPopUp;
    popUpPosition: { x: number; y: number };
  };
}) => {
  const [open, setOpen] = useState('');

  const { popupInfo } = restorationPopUpInfo;

  const handleClick = useCallback(
    (id: string) => {
      if (!open || id !== open) {
        setOpen(id);
      } else {
        setOpen(null);
      }
    },
    [open]
  );

  // const removePopUp = () => {
  //   setRestorationPopUp({});
  // };

  return (
    // <Popup
    //   anchor={anchor()}
    //   longitude={popup[1] || null}
    //   latitude={popup[0] || null}
    //   onClose={removePopUp}
    //   className=""
    // >
    <div className="c-restoration-popup relative flex w-[460px] flex-col items-start rounded-[20px] bg-white">
      <RestorationScores
        data={popupInfo}
        isOpen={open === 'restoration'}
        handleClick={() => handleClick('restoration')}
      />
      <Details
        data={popupInfo}
        isOpen={open === 'details'}
        handleClick={() => handleClick('details')}
      />
      <EcosystemServices
        data={popupInfo}
        isOpen={open === 'ecosystem'}
        handleClick={() => handleClick('ecosystem')}
      />
    </div>
    // </Popup>
  );
};

export default PopupRestoration;
