import { useMemo } from 'react';

import cn from 'lib/classnames';

import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import { useScreenWidth } from 'hooks/media';

import { DOWNLOAD, INFO, LAYERS } from 'containers/datasets';
import Helper from 'containers/guide/helper';
import { useWidgets } from 'containers/widgets/hooks';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import { breakpoints } from 'styles/styles.config';
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
  const screenWidth = useScreenWidth();
  const [activeWidgets, setActiveWidgets] = useRecoilState(activeWidgetsAtom);
  const isActive = useMemo(() => activeWidgets.includes(id), [activeWidgets, id]);
  const widgets = useWidgets();

  const download = DOWNLOAD[id] || content?.download;
  const info = INFO[id] || content?.info;
  const layer = LAYERS[id] || content?.layer;

  const handleClick = () => {
    const widgetsUpdate = isActive ? activeWidgets.filter((w) => w !== id) : [id, ...activeWidgets];
    setActiveWidgets(widgetsUpdate);
  };

  const HELPER_ID = id === widgets[0].slug;

  return (
    <div
      className={cn({
        'flex items-center space-x-2': true,
        'print:hidden': screenWidth >= breakpoints.lg,
      })}
    >
      {!!download && <Download id={id} content={download} />}
      {!!info && <Info id={id} content={info} />}
      {!!layer && (
        <Helper
          className={{
            button: HELPER_ID ? '-bottom-3.5 -right-1.5 z-[20]' : 'hidden',
            tooltip: 'w-28',
          }}
          tooltipPosition={{ top: 60, left: 42 }}
          message="Toggle layer"
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
