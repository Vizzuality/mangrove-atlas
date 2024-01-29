import { useCallback, type MouseEvent } from 'react';

import cn from 'lib/classnames';
import { useSyncCategory, useSyncDatasets } from 'lib/utils/sync-query';

import CATEGORY_OPTIONS from 'containers/navigation/constants';
import widgets from 'containers/widgets/constants';

import { Checkbox, CheckboxIndicator } from 'components/checkbox';
import Icon from 'components/icon';

import CHECK_SVG from 'svgs/ui/check.svg?sprite';

const Category = () => {
  const [categorySelected, setCategory] = useSyncCategory();
  const [, setDatasets] = useSyncDatasets();
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement & { value }>) => {
      event.preventDefault();
      setCategory(event.currentTarget.value);
      const widgetsFiltered = widgets.filter((widget) =>
        widget?.categoryIds?.includes(event.currentTarget.value)
      );
      const activeWidgetsIds = widgetsFiltered.map((widget) => widget.slug);

      setDatasets(activeWidgetsIds);
    },
    [setDatasets, setCategory]
  );

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[1px]">presets</p>
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
                'border-2 border-brand-800 font-bold text-brand-800':
                  category.value === categorySelected,
              })}
              defaultChecked={category?.defaultCategory}
            >
              <h4 className="flex min-h-[40px] items-center justify-center">{category.label}</h4>
              <Checkbox
                className={cn({
                  'absolute bottom-2 right-2 h-4 w-4 rounded-full border-none md:h-6 md:w-6': true,
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
