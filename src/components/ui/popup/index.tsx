import { ReactNode } from 'react';

import { Popup as PopupReactMapGL } from 'react-map-gl';

import Icon from 'components/ui/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';

const Popup = ({
  children,
  popUpPosition,
  popUpWidth,
  longitude,
  latitude,
  onClose,
}: {
  children: ReactNode;
  longitude: number;
  latitude: number;
  popUpPosition: { x: number; y: number };
  popUpWidth: number;
  onClose: () => void;
}) => {
  const sidebarWidth = 630;

  const anchor = () => {
    if (popUpPosition.x < sidebarWidth + popUpWidth) return 'left';
    else if (popUpPosition.y - popUpWidth < 0) return 'top';
    else if (popUpPosition.x - popUpWidth > popUpWidth) return 'right';
    else return 'bottom';
  };

  return (
    <PopupReactMapGL
      anchor={anchor()}
      longitude={longitude || null}
      latitude={latitude || null}
      onClose={onClose}
      closeOnClick={false}
      className="relative min-w-fit p-0"
    >
      <div className="relative flex h-full  min-w-fit grow flex-col justify-between divide-y divide-gray-100 lg:max-w-sm">
        {children}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 -right-10 z-50 h-11 w-10 cursor-pointer items-center justify-end rounded-r-[20px] bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <Icon icon={CLOSE_SVG} className="ml-1 h-6 w-6" description="Close" />
        </button>
      </div>
    </PopupReactMapGL>
  );
};

export default Popup;
