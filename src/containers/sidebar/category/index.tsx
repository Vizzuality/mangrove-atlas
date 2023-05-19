import { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import { activeCategoryAtom } from 'store/sidebar';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRecoilState } from 'recoil';

import { CATEGORY_OPTIONS } from 'containers/sidebar/constants';

import Icon from 'components/icon';

const Category = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [category, setCategory] = useRecoilState(activeCategoryAtom);

  const openMenu = useCallback(() => {
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="relative flex flex-col text-center">
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
          <DropdownMenu.Trigger>
            <div
              className="relative flex w-11 flex-col items-center justify-center space-y-3 rounded-full bg-white py-1 text-brand-800"
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
                      'h-8 w-8 rounded-full stroke-none': true,
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
              className="z-50 rounded-[26px] bg-white p-1.5 font-sans text-[19px] font-light text-black/85 shadow-md animate-in duration-300 focus:outline-none data-[state=open]:fade-in-60 data-[state=close]:slide-in-from-left-0 data-[state=open]:slide-in-from-left-96"
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
                      onClick={() => {
                        setCategory(id);
                        closeMenu();
                      }}
                    >
                      <div
                        className={cn({
                          'h-10.5 flex w-11 items-center justify-center': true,
                        })}
                      >
                        <Icon
                          icon={icon}
                          className={cn({
                            'h-8 w-8 stroke-none': true,
                            'rounded-full bg-brand-800 fill-current text-white': category === id,
                            'fill-current text-brand-800': category !== id,
                          })}
                        />
                      </div>
                      <p className="whitespace-nowrap">{label}</p>
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
