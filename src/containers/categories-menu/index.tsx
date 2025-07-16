import { useCallback, type MouseEvent } from 'react';

import cn from 'lib/classnames';

import { activeLayersAtom } from 'store/layers';
import { activeCategoryAtom } from 'store/sidebar';
import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState, useSetRecoilState } from 'recoil';

import CATEGORY_OPTIONS from 'containers/navigation/constants';
import widgets, { LAYERS_BY_CATEGORY } from 'containers/widgets/constants';

import { Checkbox, CheckboxIndicator } from 'components/ui/checkbox';
import Icon from 'components/ui/icon';
import type { Category } from 'types/category';
import type { ActiveLayers } from 'types/layers';
import type { ContextualBasemapsId, WidgetSlugType } from 'types/widget';

import CHECK_SVG from 'svgs/ui/check.svg?sprite';
import { trackEvent } from 'lib/analytics/ga';

const Category = () => {
  const [categorySelected, setCategory] = useRecoilState(activeCategoryAtom);
  const setActiveWidgets = useSetRecoilState(activeWidgetsAtom);
  const setActiveLayers = useSetRecoilState(activeLayersAtom);
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement & { value }>) => {
      event.preventDefault();
      setCategory(encodeURIComponent(event.currentTarget.value as Category));
      const widgetsFiltered = widgets.filter((widget) =>
        widget?.categoryIds?.includes(event.currentTarget.value as Category)
      );
      const activeWidgetsIds = widgetsFiltered.map((widget) => widget.slug);
      const activeLayersIds: ActiveLayers[] = LAYERS_BY_CATEGORY[
        event.currentTarget.value as string
      ]?.map((id) => ({
        id: id as WidgetSlugType | ContextualBasemapsId | 'custom-area',
        opacity: '1',
        visibility: 'visible',
      }));

      // Google Analytics tracking
      trackEvent(`Change category - ${event.currentTarget.value}`, {
        action: 'Change widgets category',
        label: `Change category - from ${categorySelected} to ${event.currentTarget.value}`,
      });

      // No extra tracking for layers or widgets as it’s already intrinsic to the category selection
      setActiveWidgets(activeWidgetsIds);
      setActiveLayers(activeLayersIds);
    },
    [setActiveWidgets, setActiveLayers, setCategory]
  );

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[1px]">presets</p>
      <div className="grid grid-cols-3 gap-4 py-2">
        {CATEGORY_OPTIONS.map((category) => {
          return (
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
                  'border-2 border-brand-800 font-bold text-brand-800':
                    category.value === categorySelected ||
                    (categorySelected === 'all_datasets' && category.value === 'custom'),
                })}
                defaultChecked={'distribution_and_change' === category.value}
              >
                <h4 className="flex min-h-[40px] items-center justify-center">{category.label}</h4>
                <Checkbox
                  className={cn({
                    'absolute bottom-1 right-1 h-4 w-4 rounded-full border-none md:h-6 md:w-6':
                      true,
                  })}
                  checked={
                    category.value === categorySelected ||
                    (categorySelected === 'all_datasets' && category.value === 'custom')
                  }
                >
                  <CheckboxIndicator>
                    <Icon
                      icon={CHECK_SVG}
                      className="h-full w-full fill-current text-white"
                      description="Checkmark"
                    />
                  </CheckboxIndicator>
                </Checkbox>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Category;
