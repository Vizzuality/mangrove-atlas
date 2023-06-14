import { useCallback, useState } from 'react';

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

  return (
    <div className="c-restoration-popup relative flex w-[460px] flex-col items-start rounded-3xl bg-white">
      <RestorationScores
        data={restorationPopUpInfo?.popupInfo}
        isOpen={open === 'restoration'}
        handleClick={() => handleClick('restoration')}
      />
      <Details
        data={restorationPopUpInfo?.popupInfo}
        isOpen={open === 'details'}
        handleClick={() => handleClick('details')}
      />
      <EcosystemServices
        data={restorationPopUpInfo?.popupInfo}
        isOpen={open === 'ecosystem'}
        handleClick={() => handleClick('ecosystem')}
      />
    </div>
  );
};

export default PopupRestoration;
