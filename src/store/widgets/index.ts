import { atom } from 'recoil';

import widgets from 'containers/widgets/constants';

export const widgetsCollapsedAtom = atom({
  key: 'widgets-collapsed',
  default: widgets.reduce((previousObject, currentObject) => {
    return Object.assign(previousObject, {
      ...previousObject,
      [currentObject.slug]: false,
      mangrove_drawing_tool: false,
      mangrove_drawing_upload_tool: false,
    });
  }, {}),
});
