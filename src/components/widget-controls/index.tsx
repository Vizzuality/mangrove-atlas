import { useMemo } from 'react';

import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import { DOWNLOAD, INFO, LAYERS } from 'containers/datasets';
import Helper from 'containers/helper';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import type { WidgetSlugType } from 'types/widget';

import Download from './download';
import Info from './info';

type ContentType = {
  info: string;
  download: string;
  layer?: string;
};

type WidgetControlsType = Readonly<{
  id?: WidgetSlugType;
  content?: ContentType;
}>;

const WidgetControls = ({ id, content }: WidgetControlsType) => {
  const [activeWidgets, setActiveWidgets] = useRecoilState(activeWidgetsAtom);
  const isActive = useMemo(() => activeWidgets.includes(id), [activeWidgets, id]);

  const download = DOWNLOAD[id] || content?.download;
  const info = INFO[id] || content?.info;
  const layer = LAYERS[id] || content?.layer;

  const handleClick = () => {
    const widgetsUpdate = isActive ? activeWidgets.filter((w) => w !== id) : [...activeWidgets, id];
    setActiveWidgets(widgetsUpdate);
  };

  return (
    <div className="flex items-center space-x-2 print:hidden">
      {!!download && <Download id={id} content={download} />}
      {!!info && <Info id={id} content={info} />}
      {!!layer && (
        <Helper
          className={{
            button: '-bottom-2 z-[20]',
            tooltip: '-left-20 bottom-6 w-44',
          }}
          message="This is is a message to inform the user about the layer"
        >
          <SwitchWrapper id={id}>
            <SwitchRoot onClick={handleClick} defaultChecked={isActive} checked={isActive}>
              <SwitchThumb />
            </SwitchRoot>
          </SwitchWrapper>
        </Helper>
      )}
    </div>
  );
};

export default WidgetControls;
