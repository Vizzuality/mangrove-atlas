import { useCallback, useState, MouseEvent, useMemo, useEffect } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom } from 'store/drawing-tool';
import { mapSettingsAtom } from 'store/map-settings';
import { activeCategoryAtom, useSetActiveCategory } from 'store/sidebar';
import { widgetsCollapsedAtom } from 'store/widgets';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { VscLayers } from 'react-icons/vsc';
import { useRecoilState, useRecoilValue } from 'recoil';

import CATEGORY_OPTIONS from 'containers/navigation/constants';
import { useWidgets } from 'containers/widgets/hooks';

import Icon from 'components/icon';

const Category = () => {
  const widgets = useWidgets();
  const [isOpen, setIsOpen] = useState(false);
  const [drawingToolState, setDrawingToolState] = useRecoilState(drawingToolAtom);
  const category = useRecoilValue(activeCategoryAtom);
  const setCategory = useSetActiveCategory();
  const [widgetsCollapsed, setWidgetsCollapsed] = useRecoilState(widgetsCollapsedAtom);
  const [mapSettings, setMapSettings] = useRecoilState(mapSettingsAtom);

  const lastWidgetSlug = useMemo(() => widgets.at(-1)?.slug, [widgets]);

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

    updateWidgetsCollapsed[lastWidgetSlug || 'mangrove_drawing_tool'] = false;
    setWidgetsCollapsed(updateWidgetsCollapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, lastWidgetSlug]);

  const handleCategory = useCallback(
    async (evt: MouseEvent<HTMLButtonElement>) => {
      await setCategory(evt.currentTarget.dataset.category);

      if (mapSettings) setMapSettings(false);
      setDrawingToolState((prevDrawingToolState) => ({
        ...prevDrawingToolState,
        showWidget: false,
      }));

      closeMenu();
    },
    [setDrawingToolState, closeMenu, mapSettings, setMapSettings, setCategory]
  );

  return (
    <div
      className={cn({
        'relative flex max-w-[45px] flex-col text-center': true,
        'cursor-not-allowed opacity-50': isDrawingToolWidgetVisible,
      })}
    >
      <div
        className={cn({
          'inset w-fit-content pointer-events-none absolute top-0 left-0 z-50 h-full bg-black/70 opacity-0 transition-opacity':
            true,
          'opacity-1': isOpen,
        })}
      />
      <div className="w-full py-2 font-sans text-xxs leading-[10px] text-white">Category</div>
      <div className="relative flex flex-col items-center justify-center space-y-4 rounded-full bg-white py-1 text-brand-800">
        <DropdownMenu.Root open={isOpen}>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="relative flex w-11 flex-col items-center justify-center space-y-2.5 rounded-full bg-white text-brand-800"
              onMouseOver={isDrawingToolWidgetVisible ? null : openMenu}
              disabled={isDrawingToolWidgetVisible}
              data-testid="show-categories-button"
            >
              {CATEGORY_OPTIONS.map(({ id, icon }) => (
                <div
                  key={id}
                  className={cn({
                    'flex cursor-pointer items-center justify-center': true,
                    'cursor-not-allowed opacity-50': isDrawingToolWidgetVisible,
                  })}
                  data-isactive={category === id && !mapSettings}
                >
                  {id === 'contextual_layers' && (
                    <VscLayers
                      className={cn({
                        'h-9 w-9 rounded-full fill-current stroke-none p-1 hover:text-brand-800':
                          true,
                        'bg-brand-800 fill-current text-white':
                          category === 'contextual_layers' && !mapSettings,
                        'fill-current text-brand-800':
                          category !== 'contextual_layers' || mapSettings,
                      })}
                    />
                  )}
                  {id !== 'contextual_layers' && (
                    <Icon
                      icon={icon}
                      className={cn({
                        'h-9 w-9 rounded-full stroke-none p-1': true,
                        'bg-brand-800 fill-current text-white': category === id && !mapSettings,
                        'fill-current text-brand-800': category !== id || mapSettings,
                      })}
                      description={category}
                    />
                  )}
                </div>
              ))}
            </button>
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
                  <li key={label}>
                    <button
                      type="button"
                      className="group flex cursor-pointer items-center space-x-3"
                      data-category={id}
                      onClick={handleCategory}
                    >
                      <div
                        className={cn({
                          'flex h-11 w-11 items-center justify-center': true,
                        })}
                      >
                        {id === 'contextual_layers' && (
                          <VscLayers
                            className={cn({
                              'h-9 w-9 rounded-full stroke-none p-1': true,
                              'bg-brand-800 fill-current text-white': category === id,
                              'fill-current text-brand-800 group-hover:bg-brand-800/15':
                                category !== id,
                            })}
                          />
                        )}
                        {id !== 'contextual_layers' && (
                          <Icon
                            icon={icon}
                            className={cn({
                              'h-9 w-9 rounded-full stroke-none p-1': true,
                              'bg-brand-800 fill-current text-white': category === id,
                              'fill-current text-brand-800 group-hover:bg-brand-800/15':
                                category !== id,
                            })}
                            description={category}
                          />
                        )}
                      </div>
                      <p className="whitespace-nowrap font-sans text-black/85 transition-all duration-300">
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
