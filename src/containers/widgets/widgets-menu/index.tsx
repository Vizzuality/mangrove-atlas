import React, { useCallback, FC, useEffect } from 'react';

import flatten from 'lodash-es/flatten';
import uniq from 'lodash-es/uniq';

import cn from 'lib/classnames';
import { useSyncDatasets } from 'lib/utils/sync-query';

import { activeLayersAtom } from 'store/layers';
import { activeCategoryAtom } from 'store/sidebar';

import { Checkbox } from '@radix-ui/react-checkbox';
import type { Visibility } from 'mapbox-gl';
import { FaCheck } from 'react-icons/fa';
import { useRecoilState } from 'recoil';

import { LAYERS } from 'containers/layers/constants';
import widgets from 'containers/widgets/constants';
import { useWidgetsIdsByLocation } from 'containers/widgets/hooks';
import { useWidgetsIdsByCategory } from 'containers/widgets/hooks';

import { CheckboxIndicator } from 'components/checkbox';
import type { WidgetSlugType, ContextualBasemapsId } from 'types/widget';

const WidgetsMenu: FC = () => {
  const [categorySelected, setCategory] = useRecoilState(activeCategoryAtom);
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const [datasets, setDatasets] = useSyncDatasets();
  const activeLayersIds = activeLayers.map((layer) => layer.id);
  const widgetsIds = widgets.map((widget) => widget.slug);

  const enabledWidgets = useWidgetsIdsByLocation();
  // Updates the category when user changes widgets filtering throw checkboxes,
  // are activated. It identifies the category associated with the active widgets and
  // updates it accordingly.

  const cat = useWidgetsIdsByCategory(datasets);
  useEffect(() => {
    if (categorySelected !== cat) {
      setCategory(cat);
    }
  }, [setCategory, cat, categorySelected]);

  const handleWidgets = useCallback(
    (e) => {
      // activate or deactivate widget accordingly
      setDatasets(
        datasets.includes(e) ? datasets.filter((widget) => widget !== e) : [...datasets, e]
      );

      const filteredWidgets = widgets.filter((obj) => datasets.includes(obj.slug));
      const cat = uniq(flatten(filteredWidgets.map(({ categoryIds }) => categoryIds))).filter(
        (c) => c !== 'all_datasets'
      );

      const newCat = cat.length === 1 ? cat[0] : 'all_datasets';
      if (newCat !== categorySelected) setCategory(newCat);
      // if (newCat !== catAccordingWidgetsSel) setCategory(catAccordingWidgetsSel);
    },

    [datasets, setDatasets, setCategory, categorySelected]
  );

  const handleAllWidgets = useCallback(async () => {
    datasets.length === widgets.length ? await setDatasets([]) : await setDatasets(widgetsIds);
  }, [widgetsIds, setDatasets, datasets]);

  const handleAllLayers = useCallback(
    (e) => {
      const activeLayers = LAYERS.map((layer) => ({
        id: layer.id,
        opacity: '1',
        visibility: 'visible',
      }));
      e
        ? setActiveLayers(
            activeLayers as {
              id: WidgetSlugType | ContextualBasemapsId | 'custom-area';
              opacity: string;
              visibility: Visibility;
            }[]
          )
        : setActiveLayers([]);
    },
    [setActiveLayers]
  );

  const handleLayers = useCallback(
    (e: WidgetSlugType) => {
      const layersUpdate = activeLayersIds.includes(e)
        ? activeLayers.filter((w) => w.id !== e)
        : [{ id: e, opacity: '1', visibility: 'visible' as Visibility }, ...activeLayers];
      setActiveLayers(layersUpdate);
    },

    [activeLayers, activeLayersIds, setActiveLayers]
  );
  return (
    <div>
      <div className="grid grid-cols-[57px_42px_auto] gap-4 text-xs font-bold uppercase tracking-[1px]">
        <div>Widget</div>
        <div>Layer</div>
        <div>Name</div>
      </div>
      <div className="py-2">
        <div key="menu-item-all" className="grid grid-cols-[57px_42px_auto] gap-4 text-sm">
          <Checkbox
            id="all-widgets"
            data-testid="all-widgets-checkbox"
            onCheckedChange={handleAllWidgets}
            checked={widgets.length === datasets.length}
            defaultChecked={categorySelected === 'all_datasets'}
            className={cn({
              'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white text-white':
                true,
              'bg-brand-800': widgets.length === datasets.length,
            })}
          >
            <CheckboxIndicator>
              <FaCheck className="h-2.5 w-2.5 fill-current font-bold text-white" />
            </CheckboxIndicator>
          </Checkbox>

          <Checkbox
            id="all-layers"
            data-testid="all-layers-checkbox"
            onCheckedChange={handleAllLayers}
            defaultChecked={false}
            checked={LAYERS.length === activeLayers.length}
            className={cn({
              'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white text-white':
                true,
              'bg-brand-800': LAYERS.length === activeLayers.length,
            })}
          >
            <CheckboxIndicator>
              <FaCheck className="h-2.5 w-2.5 fill-current font-bold text-white" />
            </CheckboxIndicator>
          </Checkbox>
          <p
            className={cn({
              'col-span-4 col-start-3 col-end-6': true,
              'font-bold text-brand-800':
                LAYERS.length === activeLayers.length && widgets.length === datasets.length,
            })}
          >
            Select all
          </p>
        </div>
        {widgets.map(({ slug, name, layersIds }) => {
          return (
            <div
              key={`menu-item-${slug}`}
              className={cn({
                'grid grid-cols-[57px_42px_auto] gap-4 text-sm': true,
              })}
            >
              <Checkbox
                id={slug}
                data-testid={`${slug}-checkbox`}
                onCheckedChange={() => handleWidgets(slug)}
                defaultChecked
                disabled={!enabledWidgets.includes(slug)}
                checked={datasets.includes(slug)}
                className={cn({
                  'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white': true,
                  'bg-brand-800 text-white':
                    datasets.includes(slug) && enabledWidgets.includes(slug),
                })}
              >
                {enabledWidgets.includes(slug) && (
                  <CheckboxIndicator>
                    <FaCheck
                      className={cn({
                        'h-2.5 w-2.5 fill-current font-bold': true,
                        'text-white': datasets.includes(slug),
                      })}
                    />
                  </CheckboxIndicator>
                )}
              </Checkbox>
              {!!layersIds && !!layersIds.length && (
                <Checkbox
                  id={slug}
                  data-testid={`${slug}-checkbox`}
                  onCheckedChange={() => handleLayers(slug)}
                  disabled={!enabledWidgets.includes(slug)}
                  defaultChecked
                  checked={activeLayersIds.includes(slug)}
                  className={cn({
                    'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white':
                      true,
                    'bg-brand-800 font-bold text-white':
                      activeLayersIds.includes(slug) && enabledWidgets.includes(slug),
                  })}
                >
                  <CheckboxIndicator>
                    <FaCheck
                      className={cn({
                        'h-2.5 w-2.5 fill-current font-bold': true,
                        'text-white': activeLayersIds.includes(slug),
                      })}
                    />
                  </CheckboxIndicator>
                </Checkbox>
              )}
              <p
                className={cn({
                  'col-span-4 col-start-3 col-end-6': true,
                  'font-bold text-brand-800':
                    activeLayersIds.includes(slug) || datasets.includes(slug),
                  'opacity-40': !enabledWidgets.includes(slug),
                })}
                key={slug}
              >
                {name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WidgetsMenu;
