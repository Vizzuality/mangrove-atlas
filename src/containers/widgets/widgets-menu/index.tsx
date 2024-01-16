import React, { useCallback, FC, useEffect } from 'react';

import flatten from 'lodash-es/flatten';
import uniq from 'lodash-es/uniq';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';
import { activeCategoryAtom } from 'store/sidebar';
import { activeWidgetsAtom } from 'store/widgets';

import { Checkbox } from '@radix-ui/react-checkbox';
import type { Visibility } from 'mapbox-gl';
import { FaCheck } from 'react-icons/fa';
import { useRecoilState } from 'recoil';

import { LAYERS } from 'containers/layers/constants';
import widgets from 'containers/widgets/constants';
import { useWidgetsIdsByCategory } from 'containers/widgets/hooks';
import { useWidgetsIdsByLocation } from 'containers/widgets/hooks';

import { CheckboxIndicator } from 'components/checkbox';
import type { WidgetSlugType, ContextualBasemapsId } from 'types/widget';

const WidgetsMenu: FC = () => {
  const [categorySelected, setCategory] = useRecoilState(activeCategoryAtom);
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const [activeWidgets, setActiveWidgets] = useRecoilState(activeWidgetsAtom);
  const activeLayersIds = activeLayers.map((layer) => layer.id);
  const widgetsIds = widgets.map((widget) => widget.slug);

  const enabledWidgets = useWidgetsIdsByLocation();

  const cat = useWidgetsIdsByCategory(activeWidgets);
  useEffect(() => {
    if (categorySelected !== cat) {
      setCategory(cat);
    }
  }, [categorySelected, setCategory, cat]);
  const handleWidgets = useCallback(
    (e) => {
      // activate or deactivate widget accordingly
      setActiveWidgets(
        activeWidgets.includes(e)
          ? activeWidgets.filter((widget) => widget !== e)
          : [...activeWidgets, e]
      );

      const filteredWidgets = widgets.filter((obj) => activeWidgets.includes(obj.slug));
      const cat = uniq(flatten(filteredWidgets.map(({ categoryIds }) => categoryIds))).filter(
        (c) => c !== 'all_datasets'
      );

      const newCat = cat.length === 1 ? cat[0] : 'all_datasets';

      if (newCat !== categorySelected) setCategory(newCat);
    },

    [activeWidgets, setActiveWidgets, setCategory, categorySelected]
  );

  const handleAllWidgets = useCallback(
    (e) => {
      e ? setActiveWidgets(widgetsIds) : setActiveWidgets([]);
    },
    [widgetsIds, setActiveWidgets]
  );

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
    (e) => {
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
          {categorySelected === 'all_datasets' && (
            <Checkbox
              id="all-widgets"
              data-testid="all-widgets-checkbox"
              onCheckedChange={handleAllWidgets}
              defaultChecked={true}
              className={cn({
                'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white': true,
                'bg-brand-800 text-white': widgets.length === activeWidgets.length,
              })}
            >
              <CheckboxIndicator>
                <FaCheck
                  className={cn({
                    'h-2.5 w-2.5 fill-current font-bold': true,
                    'text-white': widgets.length === activeWidgets.length,
                  })}
                />
              </CheckboxIndicator>
            </Checkbox>
          )}
          {categorySelected !== 'all_datasets' && (
            <Checkbox
              id="all-widgets"
              data-testid="all-widgets-checkbox"
              onCheckedChange={handleAllWidgets}
              defaultChecked={false}
              className={cn({
                'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white': true,
                'bg-brand-800 text-white': widgets.length === activeWidgets.length,
              })}
            >
              <CheckboxIndicator>
                <FaCheck
                  className={cn({
                    'h-2.5 w-2.5 fill-current font-bold': true,
                    'text-white': widgets.length === activeWidgets.length,
                  })}
                />
              </CheckboxIndicator>
            </Checkbox>
          )}
          <Checkbox
            id="all-layers"
            data-testid="all-layers-checkbox"
            onCheckedChange={handleAllLayers}
            defaultChecked={false}
            className={cn({
              'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white': true,
              'bg-brand-800 font-bold text-white': LAYERS.length === activeLayers.length,
            })}
          >
            <CheckboxIndicator>
              <FaCheck
                className={cn({
                  'h-2.5 w-2.5 fill-current font-bold': true,
                  'text-white': LAYERS.length === activeLayers.length,
                })}
              />
            </CheckboxIndicator>
          </Checkbox>
          <p
            className={cn({
              'col-span-4 col-start-3 col-end-6': true,
              'font-bold text-brand-800':
                LAYERS.length === activeLayers.length || widgets.length === activeWidgets.length,
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
                checked={activeWidgets.includes(slug)}
                className={cn({
                  'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white': true,
                  'bg-brand-800 text-white': activeWidgets.includes(slug),
                })}
              >
                <CheckboxIndicator>
                  <FaCheck
                    className={cn({
                      'h-2.5 w-2.5 fill-current font-bold': true,
                      'text-white': activeWidgets.includes(slug),
                    })}
                  />
                </CheckboxIndicator>
              </Checkbox>
              {!!layersIds && !!layersIds.length && (
                <Checkbox
                  id={slug}
                  data-testid={`${slug}-checkbox`}
                  onCheckedChange={() => handleLayers(slug)}
                  defaultChecked
                  checked={activeLayersIds.includes(slug)}
                  className={cn({
                    'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white':
                      true,
                    'bg-brand-800 font-bold text-white': activeLayersIds.includes(slug),
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
                    activeLayersIds.includes(slug) || activeWidgets.includes(slug),
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
