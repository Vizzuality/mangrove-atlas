import { DOWNLOAD, INFO, LAYERS } from 'containers/datasets';

import type { WidgetSlugType } from 'types/widget';

import Download from './download';
import Info from './info';
import LayerToggle from './layer-toggle';

type ContentType = {
  description: string;
  link: string;
  name: string;
  layer?: string;
};

type WidgetControlsType = Readonly<{
  id?: WidgetSlugType;
  contextualLayers?: string[];
  content?: ContentType;
}>;

const WidgetControls = ({ id, content }: WidgetControlsType) => {
  const download = DOWNLOAD[id] || content;
  const info = INFO[id] || content?.description;
  const layer = LAYERS[id] || content?.layer;

  return (
    <div className="flex items-center space-x-2 print:hidden">
      {!!download && <Download id={id} content={download} />}
      {!!info && <Info id={id} content={info} />}
      {!!layer && <LayerToggle id={id} />}
    </div>
  );
};

export default WidgetControls;
