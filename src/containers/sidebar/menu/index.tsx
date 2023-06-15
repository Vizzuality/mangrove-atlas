import { useCallback, useState } from 'react';

import Image, { StaticImageData } from 'next/image';

import BlogContent from 'containers/blog/content';
import { EXT_MENU_OPTIONS, STYLES } from 'containers/sidebar/constants';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import GMA_PNG from 'images/gma.png';

import MENU_SVG from 'svgs/sidebar/menu.svg?sprite';

const Menu = () => {
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [section, setSection] = useState('main');

  const handleOpenSubmenu = useCallback(() => setOpenSubmenu(!openSubmenu), [openSubmenu]);

  return (
    <div>
      <div className="hidden w-full pb-1 text-center font-sans text-xxs text-white md:block">
        Menu
      </div>
      <div className={`${STYLES['icon-wrapper']}`}>
        <Dialog>
          <DialogTrigger>
            <div
              className="flex justify-center rounded-full p-1 md:bg-white"
              onClick={() => setSection('main')}
            >
              <Icon
                icon={MENU_SVG}
                className="h-8 w-10 stroke-white stroke-2 md:w-8 md:stroke-brand-800"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="scroll-y top-24 h-fit rounded-3xl px-10 py-0">
            {section === 'main' && (
              <div className="flex flex-col py-10 font-sans text-black/85">
                <h2 className="pb-8 text-3xl font-light">Global Mangrove Watch</h2>
                <div className="flex flex-col items-start space-y-4 pb-10 text-2lg font-light">
                  <a
                    href="https://www.mangrovealliance.org/about-us"
                    target="_blank"
                    rel="noreferrer"
                  >
                    About
                  </a>
                  <button onClick={() => section && setSection('news')}>News</button>
                </div>
                <div className="space-y-3 pb-6">
                  <p className="text-xs font-bold uppercase">Powered by</p>
                  <button onClick={handleOpenSubmenu}>
                    <p className="pb-3 text-left text-2lg font-light">Global Mangrove Alliance</p>
                  </button>
                </div>
                {openSubmenu && (
                  <div className="mb-14 flex flex-col space-y-3 border-l pl-7">
                    {EXT_MENU_OPTIONS.map(({ id, label, href, section }) => (
                      <a
                        key={id}
                        className="cursor-pointer text-2lg font-light"
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => section && setSection(section)}
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                )}

                <Image alt="GMA" src={GMA_PNG as StaticImageData} width={133} height={58} />
              </div>
            )}

            {section === 'news' && (
              <div className="no-scrollbar overflow-y-auto pt-3 font-sans">
                <BlogContent />
              </div>
            )}
            <DialogClose />
          </DialogContent>
        </Dialog>
      </div>
      <div className="block w-full text-center font-sans text-xxs text-white md:hidden">Menu</div>
    </div>
  );
};

export default Menu;
