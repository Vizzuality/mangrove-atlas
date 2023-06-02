import { useCallback, useState } from 'react';

import { Popup } from 'react-map-gl';

import { restorationPopUpAtom } from 'store/map';

import { useRecoilState } from 'recoil';

import Details from 'containers/map/restoration-popup/details';
import RestorationScores from 'containers/map/restoration-popup/restoration-scores';

const PopupRestoration = () => {
  const [open, setOpen] = useState('');
  const [restorationPopUp, setRestorationPopUp] = useRecoilState(restorationPopUpAtom);

  const {
    popUpPosition: { x, y },
    popup,
    popupInfo,
  } = restorationPopUp;

  const popUpWidth = 440;
  const sidebarWidth = 630;

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

  const removePopUp = () => {
    setRestorationPopUp({
      ...restorationPopUp,
      popup: [],
    });
  };

  const anchor = () => {
    if (x < sidebarWidth + popUpWidth) return 'left';
    else if (y - popUpWidth < 0) return 'top';
    else if (x - popUpWidth > popUpWidth) return 'right';
    else return 'bottom';
  };

  return (
    <Popup
      anchor={anchor()}
      longitude={popup[0] || null}
      latitude={popup[1] || null}
      onClose={removePopUp}
      className="c-restoration-popup"
    >
      <div className="w-fit-content h-96">
        <div className="relative flex max-w-[460px] flex-col items-start bg-white">
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
          {/*
         <EcosystemServicesInfo
           data={this.state.popupInfo}
           isOpen={open === 'ecosystem'}
           handleClick={() => handleClick('ecosystem')}
         /> */}
        </div>
      </div>
    </Popup>
  );
};

export default PopupRestoration;
