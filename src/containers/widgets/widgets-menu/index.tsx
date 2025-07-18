import React, { useCallback, FC } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';
import { activeCategoryAtom } from 'store/sidebar';
import { activeWidgetsAtom } from 'store/widgets';

import { Checkbox } from '@radix-ui/react-checkbox';
import type { Visibility } from 'mapbox-gl';
import { FaCheck } from 'react-icons/fa';
import { useRecoilState } from 'recoil';

import { LAYERS } from 'containers/layers/constants';
import { widgets as rawWidgets } from 'containers/widgets/constants';
import { useWidgetsIdsByLocation } from 'containers/widgets/hooks';
import { findCategoryByWidgets } from 'containers/widgets/utils';

import { CheckboxIndicator } from 'components/ui/checkbox';
import type { ActiveLayers } from 'types/layers';
import type { WidgetSlugType, ContextualBasemapsId } from 'types/widget';
import { trackEvent } from 'lib/analytics/ga';

const WidgetsMenu: FC = () => {
  const [categorySelected, setCategory] = useRecoilState(activeCategoryAtom);
  const [activeLayers, setActiveLayers] = useRecoilState(activeLayersAtom);
  const [activeWidgets, setActiveWidgets] = useRecoilState(activeWidgetsAtom);
  const widgets = rawWidgets.filter(({ slug }) => slug !== 'widgets_deck_tool');

  const activeLayersIds = activeLayers?.map((layer) => layer.id);
  const widgetsIds = widgets.map((widget) => widget.slug);
  const enabledWidgets = useWidgetsIdsByLocation();

  const handleAllWidgets = useCallback(() => {
    const allActive = activeWidgets.length === widgets.length;

    // Google Analytics tracking
    if (!allActive) {
      trackEvent('Widgets deck - Widgets selection - Activate all', {
        action: 'activate widgets',
        label: 'Widgets deck tool- Activate all widgets',
      });
    }
    allActive ? setActiveWidgets([]) : setActiveWidgets(widgetsIds);
  }, [widgetsIds, setActiveWidgets, activeWidgets, widgets]);

  const handleAllLayers = useCallback(() => {
    if (activeLayers?.length <= LAYERS.length && activeLayers?.length > 0) {
      setActiveLayers([]);
    }
    if (LAYERS.length > activeLayers?.length) {
      const NewLayersActive: ActiveLayers[] = LAYERS.map((layer) => ({
        id: layer.id as WidgetSlugType | ContextualBasemapsId | 'custom-area',
        opacity: '1',
        visibility: 'visible',
      }));

      setActiveLayers(NewLayersActive);

      // Google Analytics tracking
      trackEvent('Widgets deck - Layers selection - Activate all', {
        action: 'activate layers',
        label: 'Widgets deck tool- Activate all layers',
      });
    }
  }, [setActiveLayers, activeLayers]);

  const handleWidgets = useCallback(
    (e) => {
      const isActive = activeWidgets.includes(e);

      // Google Analytics tracking
      if (!isActive) {
        trackEvent(`Widgets deck - Widget selected - ${e}`, {
          action: 'activate widget',
          label: `Widgets deck tool - widget -${e}`,
        });
      }
      const updatedWidgets = isActive
        ? activeWidgets.filter((widget) => widget !== e)
        : [...activeWidgets, e].filter((widget) => widget !== 'widgets_deck_tool');
      const newCategory = findCategoryByWidgets(updatedWidgets);
      setActiveWidgets(updatedWidgets);
      if (updatedWidgets) setCategory(newCategory);
    },

    [activeWidgets, setActiveWidgets, setCategory]
  );

  const handleLayers = useCallback(
    (e: WidgetSlugType) => {
      const isActive = activeLayersIds?.includes(e);

      // Google Analytics tracking
      if (!isActive) {
        trackEvent(`Widgets deck - Layer selected - ${e}`, {
          action: 'activate layer',
          label: `Widgets deck tool - layer - ${e}`,
        });
      }
      const layersUpdate = isActive
        ? activeLayers?.filter((w) => w.id !== e)
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
            checked={widgets.length === activeWidgets.length}
            defaultChecked={categorySelected === 'all_datasets'}
            className={cn({
              'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white text-white':
                true,
              'bg-brand-800': widgets.length === activeWidgets.length,
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
            checked={LAYERS.length === activeLayers?.length}
            className={cn({
              'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white text-white':
                true,
              'bg-brand-800': LAYERS.length === activeLayers?.length,
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
                LAYERS.length === activeLayers?.length && widgets.length === activeWidgets.length,
            })}
          >
            Select All
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
                  'bg-brand-800 text-white':
                    activeWidgets.includes(slug) && enabledWidgets.includes(slug),
                })}
              >
                {enabledWidgets.includes(slug) && (
                  <CheckboxIndicator>
                    <FaCheck
                      className={cn({
                        'h-2.5 w-2.5 fill-current font-bold': true,
                        'text-white': activeWidgets.includes(slug),
                      })}
                    />
                  </CheckboxIndicator>
                )}
              </Checkbox>
              {!!layersIds && !!layersIds.length && slug !== 'mangrove_national_dashboard' && (
                <Checkbox
                  id={slug}
                  data-testid={`${slug}-checkbox`}
                  onCheckedChange={() => handleLayers(slug)}
                  disabled={!enabledWidgets.includes(slug)}
                  defaultChecked
                  checked={activeLayersIds?.includes(slug)}
                  className={cn({
                    'text-brand-500 m-auto h-3 w-3 rounded-sm border border-black/15 bg-white':
                      true,
                    'bg-brand-800 font-bold text-white':
                      activeLayersIds?.includes(slug) && enabledWidgets.includes(slug),
                  })}
                >
                  <CheckboxIndicator>
                    <FaCheck
                      className={cn({
                        'h-2.5 w-2.5 fill-current font-bold': true,
                        'text-white': activeLayersIds?.includes(slug),
                      })}
                    />
                  </CheckboxIndicator>
                </Checkbox>
              )}
              <p
                className={cn({
                  'col-span-4 col-start-3 col-end-6': true,
                  'font-bold text-brand-800':
                    activeLayersIds?.includes(slug) || activeWidgets.includes(slug),
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
