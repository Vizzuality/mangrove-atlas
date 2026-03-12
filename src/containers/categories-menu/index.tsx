import { useCallback, type MouseEvent } from 'react';

import { trackEvent } from '@/lib/analytics/ga';
import cn from '@/lib/classnames';

import { activeLayersAtom } from '@/store/layers';
import { activeCategoryAtom } from '@/store/sidebar';
import { activeWidgetsAtom } from '@/store/widgets';

import { useRecoilState, useSetRecoilState } from 'recoil';

import CATEGORY_OPTIONS from '@/containers/navigation/constants';
import widgets, { LAYERS_BY_CATEGORY } from '@/containers/widgets/constants';

import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';
import type { Category } from 'types/category';
import type { Layer } from 'types/layers';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

import CHECK_SVG from '@/svgs/ui/check';

const Category = () => {
  const [categorySelected, setCategory] = useRecoilState(activeCategoryAtom);
  const setActiveWidgets = useSetRecoilState(activeWidgetsAtom);
  const setActiveLayers = useSetRecoilState(activeLayersAtom);

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
        {CATEGORY_OPTIONS.map((category) => (
          <button
            key={category.value}
            type="button"
            value={category.value}
            onClick={handleClick}
            data-testid={category.value}
          >
            <div
              className={cn({
                'relative flex-1 items-center justify-center rounded-xl border border-black/15 p-3 text-xs md:p-5 md:text-sm':
                  true,
                'border-brand-800 text-brand-800 border-2 font-bold':
                  category.value === categorySelected ||
                  (categorySelected === 'all_datasets' && category.value === 'custom'),
              })}
            >
              <h4 className="flex min-h-10 items-center justify-center">{category.label}</h4>

              <Checkbox
                className={cn({
                  'absolute right-1 bottom-1 h-4 w-4 rounded-full border-none md:h-6 md:w-6': true,
                })}
                checked={
                  category.value === categorySelected ||
                  (categorySelected === 'all_datasets' && category.value === 'custom')
                }
              >
                <CheckboxIndicator>
                  <CHECK_SVG
                    className="h-full w-full fill-current text-white"
                    role="img"
                    title="Checkmark"
                  />
                </CheckboxIndicator>
              </Checkbox>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Category;
