import { useMemo } from 'react';

import { interactiveIdsAtom } from 'store/map';
import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState, useRecoilValue } from 'recoil';

import { LAYERS } from 'containers/datasets';

import { WidgetSlugType } from 'types/widget';

const ProtectedAreasLayer = LAYERS['protected-areas'];
const CountryBoundariesLayer = LAYERS['country-boundaries'];

const EXCLUDED_DATA_LAYERS: WidgetSlugType[] = [
  'mangrove_habitat_extent',
] satisfies WidgetSlugType[];

const LayerManagerContainer = () => {
  const layers = useRecoilValue(activeWidgetsAtom);
  const [interactiveIds, setInteractiveIds] = useRecoilState(interactiveIdsAtom);
  const LAYERS_FILTERED = useMemo(
    () => [
      ...layers
        .filter((layer) => !EXCLUDED_DATA_LAYERS.includes(layer) && !!LAYERS[layer])
        .reverse(),
      // ? the habitat extent layer is a special case where, if enabled, it will be placed always at the bottom of the layer stack we handle
      ...(layers.includes('mangrove_habitat_extent') ? ['mangrove_habitat_extent'] : []),
    ],
    [layers]
  );
  const handleAdd = (styleIds) => {
    const updatedIds = [...interactiveIds, styleIds];
    setInteractiveIds(updatedIds);
  };

  const handleRemove = (styleIds) => {
    const updatedIds = interactiveIds.filter((id) => id === styleIds);
    setInteractiveIds(updatedIds);
  };

  return (
    <>
      {LAYERS_FILTERED.map((layer, i) => {
        const LayerComponent = LAYERS[layer];
        const beforeId = i === 0 ? 'custom-layers' : `${LAYERS_FILTERED[i - 1]}-layer`;

        return (
          <LayerComponent
            key={layer}
            id={`${layer}-layer`}
            beforeId={beforeId}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        );
      })}

      {/* Countries layer */}
      {<CountryBoundariesLayer id="country-boundaries-layer" beforeId="Country" />}
      {/* Protected areas layer */}
      {<ProtectedAreasLayer id="protected-areas-layer" beforeId="Country" />}
    </>
  );
};

export default LayerManagerContainer;
