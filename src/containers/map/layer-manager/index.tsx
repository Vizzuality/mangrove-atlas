import { activeLayersAtom } from 'store/map';

import { useRecoilValue } from 'recoil';

import { LAYERS } from 'containers/datasets';
type LayerManagerTypes = () => JSX.Element[];
// {
//   key: string;
//   id: string;
//   settings: {
//     opacity: number;
//     visibility: boolean;
//     expand: boolean;
//   };
// };
const LayerManagerContainer = () => {
  const layers = useRecoilValue(activeLayersAtom);
  // const layersSettings = useRecoilValue(layersSettingsAtom);
  const LAYERS_FILTERED = layers.filter((layer) => !!LAYERS[layer]);
  return (
    <>
      {LAYERS_FILTERED.map((layer, i) => {
        const LayerComponent = LAYERS[layer];
        // We need to define where do we want to put the layer
        // We want to put it before the custom-layers transparent backgrond
        const beforeId = i === 0 ? 'custom-layers' : `${LAYERS_FILTERED[i - 1]}-layer`;
        return (
          <LayerComponent
            key={layer}
            id={`${layer}-layer`}
            settings={
              // layersSettings[layer] ??
              {
                opacity: 1,
                visibility: false,
                expand: false,
              }
            }
            // beforeId={beforeId}
          />
        );
      })}
    </>
  );
};

export default LayerManagerContainer;
