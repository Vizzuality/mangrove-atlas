import { useCallback } from 'react';

import { useRouter } from 'next/router';

import { nationalDashboardSettingsAtom } from 'store/national-dashboard';

import { useRecoilValue } from 'recoil';

import { useLocation } from 'containers/datasets/locations/hooks';
import type { LocationTypes } from 'containers/datasets/locations/types';
import Helper from 'containers/guide/helper';
import { LAYERS } from 'containers/layers/constants';

import Icon from 'components/icon';
import { WidgetSlugType } from 'types/widget';

import REMOVE_SVG from 'svgs/remove.svg?sprite';

const Legend = ({
  layers,
  setActiveWidgets,
}: {
  layers: readonly WidgetSlugType[];
  setActiveWidgets: (layers: WidgetSlugType[]) => void;
}) => {
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0] as LocationTypes;
  const id = params?.[1];

  const {
    data: { id: locationId },
  } = useLocation(locationType, id);

  const settings = useRecoilValue(nationalDashboardSettingsAtom);
  const nationalDashboardLayerName =
    settings && Object.values(settings).filter((s) => s.locationId === locationId)[0]?.name;

  const removeLayer = useCallback(
    (layer: string) => {
      const updatedLayers = layers.filter((l) => {
        return l !== layer;
      });
      setActiveWidgets(updatedLayers);
    },
    [layers, setActiveWidgets]
  );

  const layerName = (label) => {
    return LAYERS.find((w) => w.id === label)?.name;
  };

  const HELPER_ID = layers[0];

  return (
    <div className="flex flex-col space-y-1 print:hidden">
      {!!layers.length &&
        layers.map((l) => {
          const layerNameToDisplay = layerName(l);
          if (layerNameToDisplay === undefined && l !== 'mangrove_national_dashboard_layer')
            return null;
          return (
            <Helper
              key={l}
              className={{
                button: l === HELPER_ID ? '-bottom-3.5 -left-1.5 z-[20]' : 'hidden',
                tooltip: 'w-[236px]',
              }}
              tooltipPosition={{ top: 80, left: 0 }}
              message="List of legends seen on the map. You can close them directly here"
            >
              {l !== 'mangrove_national_dashboard_layer' && (
                <div className="flex h-11 min-w-[270px] items-center justify-between rounded-md bg-white px-6 py-3 text-sm shadow-medium">
                  <p className="text-xs font-semibold uppercase">{layerNameToDisplay}</p>
                  <Helper
                    className={{
                      button: '-bottom-2 left-2 z-[20]',
                      tooltip: 'w-fit-content',
                    }}
                    tooltipPosition={{ top: 100, left: 150 }}
                    message="layers on the map can be switched off here (same as toggle on widget)"
                  >
                    <button onClick={() => removeLayer(l)}>
                      <Icon icon={REMOVE_SVG} className="h-5 w-5" />
                    </button>
                  </Helper>
                </div>
              )}
              {l === 'mangrove_national_dashboard_layer' && nationalDashboardLayerName && (
                <div className="flex h-11 min-w-[270px] items-center justify-between rounded-md bg-white px-6 py-3 text-sm shadow-medium">
                  <p className="text-xs font-semibold uppercase">{`National Dashboard: ${nationalDashboardLayerName}`}</p>
                  <button onClick={() => removeLayer(l)}>
                    <Icon icon={REMOVE_SVG} className="h-5 w-5" />
                  </button>
                </div>
              )}
            </Helper>
          );
        })}
    </div>
  );
};

export default Legend;
