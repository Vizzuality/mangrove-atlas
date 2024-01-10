import { useCallback, type MouseEvent } from 'react';

import cn from 'lib/classnames';

import { activeCategoryAtom } from 'store/sidebar';
import { customCategoryAtom } from 'store/sidebar';
import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilState } from 'recoil';

import CATEGORY_OPTIONS from 'containers/navigation/constants';
import widgets from 'containers/widgets/constants';

import { Checkbox, CheckboxIndicator } from 'components/checkbox';
import Icon from 'components/icon';
import { Category } from 'types/category';

import CHECK_SVG from 'svgs/ui/check.svg?sprite';

const Category = () => {
  const [categorySelected, setCategory] = useRecoilState(activeCategoryAtom);
  const [customWidgetSelection] = useRecoilState(customCategoryAtom);
  const [, setActiveWidgets] = useRecoilState(activeWidgetsAtom);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement & { value }>) => {
      event.preventDefault();
      setCategory(event.currentTarget.value as Category);
      const widgetsFiltered = widgets.filter((widget) =>
        widget?.categoryIds?.includes(event.currentTarget.value)
      );
      const activeWidgetsIds = widgetsFiltered.map((widget) => widget.slug);
      event.currentTarget.value === 'all_datasets'
        ? setActiveWidgets(customWidgetSelection)
        : setActiveWidgets(activeWidgetsIds);
    },
    [setActiveWidgets, setCategory, customWidgetSelection]
  );

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[1px]">presets</p>
      <div className="grid grid-cols-3 gap-4 py-2">
        {CATEGORY_OPTIONS.map((category) => (
          <button key={category.value} type="button" value={category.value} onClick={handleClick}>
            <div
              className={cn({
                'relative flex-1 justify-center rounded-xl border border-black/15 p-3 text-xs md:min-h-[90px] md:p-6 md:text-sm':
                  true,
                'border-2 border-brand-800 font-bold text-brand-800':
                  category.value === categorySelected,
              })}
              data-testid={category.value}
              defaultChecked={'distribution_and_change' === category.value}
            >
              <h4>{category.label}</h4>
              <Checkbox
                className={cn({
                  'absolute bottom-2 right-2 h-6 w-6 rounded-full border-none': true,
                })}
                checked={category.value === categorySelected}
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
        ))}
      </div>
    </div>
  );
};

export default Category;
