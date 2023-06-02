import { useCallback, useState } from 'react';

import { Popup } from 'react-map-gl';

import { restorationPopUpAtom } from 'store/map';

import { useRecoilState } from 'recoil';

export const PopupRestoration = () => {
  const [open, setOpen] = useState();
  const [restorationPopUp, setRestorationPopUp] = useRecoilState(restorationPopUpAtom);

  const handleClick = useCallback(
    (id) => {
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

  const {
    popUpPosition: { x, y },
    popup,
  } = restorationPopUp;

  const popUpWidth = 440;
  const sidebarWidth = 630;

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
    >
      <div className="w-fit">
        <div className="relative flex max-w-[460px] flex-col items-start rounded-2xl bg-white">
          {/* <RestorationInfo
           data={this.state.popupInfo}
           isOpen={open === 'restoration'}
           handleClick={() => handleClick('restoration')}
         />
         <RestorationDetailsInfo
           data={this.state.popupInfo}
           isOpen={open === 'details'}
           handleClick={() => handleClick('details')}
         />
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
