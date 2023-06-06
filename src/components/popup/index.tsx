import { ReactNode } from 'react';

import { Popup as PopupReactMapGL } from 'react-map-gl';

const Popup = ({
  children,
  popUpPosition,
  longitude,
  latitude,
  onClose,
}: {
  children: ReactNode;
  longitude: number;
  latitude: number;
  popUpPosition: { x: number; y: number };
  onClose: () => void;
}) => {
  const popUpWidth = 440;
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
      className="c-restoration-popup"
    >
      {children}
    </PopupReactMapGL>
  );
};

export default Popup;
