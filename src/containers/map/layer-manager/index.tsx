import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import { LAYERS } from 'containers/datasets';

const LayerManagerContainer = () => {
  const layers = useRecoilValue(activeWidgetsAtom);

  // const layersSettings = useRecoilValue(layersSettingsAtom);
  const LAYERS_FILTERED = layers.filter((layer) => !!LAYERS[layer]);
  const ProtectedAreasLayer = LAYERS['protected-areas'];
  const CountryBoundariesLayer = LAYERS['country-boundaries'];
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
            settings={{
              opacity: 1,
              visibility: false,
              expand: false,
            }}
            beforeId={beforeId}
          />
        );
      })}
      {/* Countries layer */}
      {<CountryBoundariesLayer id="country-boundaries-layer" />}
      {/* Protected areas layer */}
      {<ProtectedAreasLayer id="protected-areas-layer" />}
    </>
  );
};

export default LayerManagerContainer;
