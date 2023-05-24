import { useMemo } from 'react';

import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import { DOWNLOAD, INFO, LAYERS } from 'containers/datasets';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import type { WidgetSlugType } from 'types/widget';

import Download from './download';
import Info from './info';

type WidgetControlsType = Readonly<{ id: WidgetSlugType }>;

const WidgetControls = ({ id }: WidgetControlsType) => {
  const [activeWidgets, setActiveWidgets] = useRecoilState(activeWidgetsAtom);
  const isActive = useMemo(() => activeWidgets.includes(id), [activeWidgets, id]);

  const download = DOWNLOAD[id];
  const info = INFO[id];
  const layer = LAYERS[id];

  const handleClick = () => {
    const widgetsUpdate = isActive ? activeWidgets.filter((w) => w !== id) : [...activeWidgets, id];
    setActiveWidgets(widgetsUpdate);
  };
  return (
    <div className="flex items-center space-x-2">
      {!!download && <Download id={id} />}
      {!!info && <Info id={id} />}
      {!!layer && (
        <SwitchWrapper id={id}>
          <SwitchRoot onClick={handleClick} defaultChecked={isActive}>
            <SwitchThumb />
          </SwitchRoot>
        </SwitchWrapper>
      )}
    </div>
  );
};

export default WidgetControls;
