import { useCallback, useState, MouseEvent, useMemo, useEffect } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom } from 'store/drawing-tool';
import { activeCategoryAtom } from 'store/sidebar';
import { widgetsCollapsedAtom } from 'store/widgets';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRecoilState } from 'recoil';

import { CATEGORY_OPTIONS } from 'containers/sidebar/constants';
import { useWidgets } from 'containers/widgets/hooks';

import Icon from 'components/icon';

const Category = () => {
  const widgets = useWidgets();
  const [isOpen, setIsOpen] = useState(false);
  const [drawingToolState, setDrawingToolState] = useRecoilState(drawingToolAtom);
  const [category, setCategory] = useRecoilState(activeCategoryAtom);
  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);

  const lastWidgetSlug = useMemo(() => widgets.at(-1).slug, [widgets]);

  const { showWidget: isDrawingToolWidgetVisible } = drawingToolState;

  const openMenu = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const updateWidgetsCollapsed = Object.keys(widgetsCollapsed).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    updateWidgetsCollapsed[lastWidgetSlug] = false;
    setWidgetsCollapsed(updateWidgetsCollapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleCategory = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      setCategory(evt.currentTarget.dataset.category);
      setDrawingToolState((prevDrawingToolState) => ({
        ...prevDrawingToolState,
        showWidget: false,
      }));
      closeMenu();
    },
    [setDrawingToolState, setCategory, closeMenu]
  );

  return (
    <div
      className={cn({
        'relative flex flex-col text-center': true,
        'pointer-events-none opacity-50': isDrawingToolWidgetVisible,
      })}
    >
      <div
        className={cn({
          'inset pointer-events-none fixed top-0 left-0 z-50 h-full w-full bg-black/70 opacity-0 transition-opacity':
            true,
          'opacity-1': isOpen,
        })}
      />
      <div className="w-full py-2 font-sans text-xxs leading-[10px] text-white">Category</div>
      <div className="relative flex flex-col items-center justify-center space-y-4 rounded-full bg-white py-1 text-brand-800">
        <DropdownMenu.Root open={isOpen}>
          <DropdownMenu.Trigger asChild>
            <div
              className="relative flex w-11 flex-col items-center justify-center space-y-2.5 rounded-full bg-white text-brand-800"
              onMouseOver={openMenu}
            >
              {CATEGORY_OPTIONS.map(({ id, icon }) => (
                <div
                  key={id}
                  className={cn({
                    'flex cursor-pointer items-center justify-center': true,
                  })}
                >
                  <Icon
                    icon={icon}
                    className={cn({
                      'h-9 w-9 rounded-full stroke-none p-1': true,
                      'bg-brand-800 fill-current text-white': category === id,
                      'fill-current text-brand-800': category !== id,
                    })}
                  />
                </div>
              ))}
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              onMouseLeave={closeMenu}
              onEscapeKeyDown={closeMenu}
              onInteractOutside={closeMenu}
              className="z-50 min-w-[350px] rounded-[26px] bg-white p-1.5 font-sans text-2lg font-light text-black/85 shadow-md animate-in duration-300 focus:outline-none data-[state=open]:fade-in-60 data-[state=close]:slide-in-from-left-0 data-[state=open]:slide-in-from-left-96"
              align="start"
              side="right"
              sideOffset={-44}
              alignOffset={-5}
              style={{
                height: 'calc(var(--radix-dropdown-menu-trigger-height) + 1rem)',
              }}
            >
              <ul className="flex h-full flex-col justify-between">
                {CATEGORY_OPTIONS.map(({ id, label, icon }) => (
                  <li key={id}>
                    <button
                      key={id}
                      type="button"
                      className="flex cursor-pointer items-center space-x-3"
                      data-category={id}
                      onClick={handleCategory}
                    >
                      <div
                        className={cn({
                          'flex h-11 w-11 items-center justify-center': true,
                        })}
                      >
                        <Icon
                          icon={icon}
                          className={cn({
                            'h-9 w-9 stroke-none p-1': true,
                            'rounded-full bg-brand-800 fill-current text-white': category === id,
                            'fill-current text-brand-800': category !== id,
                          })}
                        />
                      </div>
                      <p className="whitespace-nowrap font-sans text-black/85 transition-all duration-300 hover:font-semibold">
                        {label}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default Category;
