import { useMemo, useCallback } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom } from 'store/drawing-tool';
import { activeLayersAtom } from 'store/layers';
import { mapSettingsAtom } from 'store/map-settings';
import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState, useRecoilValue } from 'recoil';

import { useScreenWidth } from 'hooks/media';

import { DOWNLOAD, INFO, LAYERS } from 'containers/datasets';
import Helper from 'containers/guide/helper';
import { useWidgets } from 'containers/widgets/hooks';

import { SwitchWrapper, SwitchRoot, SwitchThumb } from 'components/switch';
import { breakpoints } from 'styles/styles.config';
import type { WidgetSlugType } from 'types/widget';
import type { ContextualBasemapsId } from 'types/widget';

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
  const { showWidget } = useRecoilValue(drawingToolAtom);
  const isMapSettingsOpen = useRecoilValue(mapSettingsAtom);
  const screenWidth = useScreenWidth();
  const [activeWidgets, setActiveWidgets] = useRecoilState(activeWidgetsAtom);
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const isActive = useMemo(() => activeWidgets.includes(id), [activeWidgets, id]);
  const widgets = useWidgets();

  const download = DOWNLOAD[id] || content?.download;
  const info = INFO[id] || content?.info;
  const layer = LAYERS[id] || content?.layer;

  const handleClick = useCallback(() => {
    const layersUpdate = isActive
      ? activeLayers.filter((w) => w.id !== id)
      : ([{ id, opacity: '1' }, ...activeLayers] as {
          id: WidgetSlugType | ContextualBasemapsId | 'custom-area';
          opacity: string;
        }[]);
    setActiveLayers(layersUpdate);
  }, [isActive, activeLayers, setActiveLayers]);

  const HELPER_ID = id === widgets[0].slug;

  return (
    <div
      className={cn({
        'flex items-center space-x-2': true,
        'print:hidden': screenWidth >= breakpoints.lg,
      })}
    >
      <Helper
        className={{
          button:
            !showWidget && !isMapSettingsOpen && HELPER_ID ? '-bottom-3.5 -right-1.5' : 'hidden',
          tooltip: 'w-28',
        }}
        tooltipPosition={{ top: -40, left: 42 }}
        message="Click one of these to find background information about a layer/widget, to download data or to toggle a layer on and off on the map"
      >
        <div className="flex items-center space-x-2">
          {!!download && <Download id={id} content={download} />}
          {!!info && <Info id={id} content={info} />}
        </div>
      </Helper>

      {!!layer && (
        <Helper
          className={{
            button: HELPER_ID ? '-bottom-3.5 -right-1.5' : 'hidden',
            tooltip: 'w-fit-content',
          }}
          tooltipPosition={{ top: -40, left: 42 }}
          message="Widgets display information and statistics about a geometry on the map. Most widgets also come with map layer that can be toggled on or off"
        >
          <SwitchWrapper id={id}>
            <SwitchRoot
              data-testid={id}
              onClick={handleClick}
              defaultChecked={isActive}
              checked={isActive}
            >
              <SwitchThumb />
            </SwitchRoot>
          </SwitchWrapper>
        </Helper>
      )}
    </div>
  );
};

export default WidgetControls;
