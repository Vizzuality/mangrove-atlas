import { useCallback, useState } from 'react';

import { Popup } from 'react-map-gl';

import { restorationPopUpAtom } from 'store/map';

import { useRecoilState } from 'recoil';

import RestorationInfo from 'components/map/restoration-popup/restoration-info';

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
    >
      <div className="w-fit-content h-96">
        <div className="relative flex max-w-[460px] flex-col items-start rounded-3xl bg-white">
          <RestorationInfo
            data={popupInfo}
            isOpen={open === 'restoration'}
            handleClick={() => handleClick('restoration')}
          />
          {/* <RestorationDetailsInfo
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
