import { useCallback, type MouseEvent } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { useSyncActiveLayers } from '@/store/layers';
import { useSyncActiveCategory } from '@/store/sidebar';
import { useSyncActiveWidgets } from '@/store/widgets';

import CATEGORY_OPTIONS from '@/containers/navigation/constants';
import widgets, { LAYERS_BY_CATEGORY } from '@/containers/widgets/constants';

import type { Category } from 'types/category';
import type { Layer } from 'types/layers';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

import CHECK_SVG from '@/svgs/ui/check';

const Category = () => {
  const [categorySelected, setCategory] = useSyncActiveCategory();
  const [, setActiveWidgets] = useSyncActiveWidgets();
  const [, setActiveLayers] = useSyncActiveLayers();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      const nextCategory = event.currentTarget.value as Category;

      setCategory(nextCategory);

      const widgetsFiltered = widgets.filter((widget) =>
        widget?.categoryIds?.includes(nextCategory)
      );

      const activeWidgetsIds = widgetsFiltered.map((widget) => widget.slug);

      const activeLayersIds: Layer[] =
        LAYERS_BY_CATEGORY[nextCategory]?.map((id) => ({
          id: id as WidgetSlugType | ContextualBasemapsId | 'custom-area',
          opacity: '1',
          visibility: 'visible',
        })) ?? [];

      trackEvent(`Change category - ${nextCategory}`, {
        category: 'Widgets deck',
        action: 'Click',
        label: `Change category - from ${categorySelected} to ${nextCategory}`,
        value: nextCategory,
      });

      setActiveWidgets(activeWidgetsIds);
      setActiveLayers(activeLayersIds);
    },
    [categorySelected, setActiveWidgets, setActiveLayers, setCategory]
  );

  return (
    <div>
      <p className="text-xs font-bold tracking-[1px] uppercase">presets</p>

      <div className="grid grid-cols-3 gap-4 py-2">
        {CATEGORY_OPTIONS.map((category) => {
          const isSelected =
            category.value === categorySelected ||
            (categorySelected === 'all_datasets' && category.value === 'custom');

          return (
            <button
              key={category.value}
              type="button"
              value={category.value}
              onClick={handleClick}
              aria-pressed={isSelected}
              data-testid={category.value}
              className="cursor-pointer"
            >
              <div
                className={cn({
                  'relative flex-1 items-center justify-center rounded-xl border border-black/15 p-3 text-xs md:p-5 md:text-sm':
                    true,
                  'border-brand-800 text-brand-800 border-2 font-bold': isSelected,
                })}
              >
                <h4 className="flex min-h-10 items-center justify-center">{category.label}</h4>

                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute right-1 bottom-1 flex h-4 w-4 items-center justify-center rounded-full md:h-6 md:w-6',
                    {
                      'border-brand-800 bg-brand-800 border-4 text-white': isSelected,
                    }
                  )}
                >
                  {isSelected && (
                    <CHECK_SVG
                      className="h-full w-full fill-current p-px text-white"
                      role="img"
                      title="Checkmark"
                    />
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Category;
