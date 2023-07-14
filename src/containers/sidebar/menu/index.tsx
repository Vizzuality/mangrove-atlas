import { useCallback, useState } from 'react';

import Image, { StaticImageData } from 'next/image';

import cn from 'lib/classnames';

import { AnimatePresence, motion } from 'framer-motion';

import BlogContent from 'containers/blog/content';
import Helper from 'containers/guide/helper';
import { EXT_MENU_OPTIONS, STYLES } from 'containers/sidebar/constants';
import About from 'containers/sidebar/menu/about';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';
import { Media } from 'components/media-query';

import GMA_PNG from 'images/gma.png';

import ABERYSTWYTH_SVG from 'svgs/partners/aberystwyth.svg?sprite';
import NATURE_CONSERVANCY_SVG from 'svgs/partners/nature.svg?sprite';
import SOLO_SVG from 'svgs/partners/solo.svg?sprite';
import WETLANDS_SVG from 'svgs/partners/wetlands.svg?sprite';
import MENU_SVG from 'svgs/sidebar/menu.svg?sprite';
import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';
const Menu = () => {
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [section, setSection] = useState('main');

  const handleOpenSubmenu = useCallback(() => setOpenSubmenu(!openSubmenu), [openSubmenu]);
  return (
    <div className="relative">
      <Helper
        className={{
          button: '-bottom-10 -right-1.5 z-[20]',
          tooltip: 'w-fit-content',
        }}
        tooltipPosition={{ top: -10, left: -60 }}
        message="main menu"
      >
        <div className="hidden w-full pb-1 text-center font-sans text-xxs text-white md:block">
          Menu
        </div>
        <div className={`${STYLES['icon-wrapper']}`}>
          <Dialog>
            <DialogTrigger>
              <button
                data-testid="menu-button"
                type="button"
                className="flex justify-center rounded-full p-1 md:bg-white"
                onClick={() => setSection('main')}
              >
                <Icon
                  icon={MENU_SVG}
                  className="h-8 w-10 stroke-white stroke-2 md:w-8 md:stroke-brand-800"
                />
              </button>
            </DialogTrigger>

            <DialogContent
              data-testid="menu-content"
              className={cn({
                'scroll-y md:translate-0 rounded-3xl px-10 font-sans md:top-[5vh] md:max-w-xl':
                  true,
                'h-fit py-0': section === 'main',
                'h-[96%] pt-10 pb-0 md:h-[90vh] md:py-0': section === 'news' || section === 'about',
                'md:translate-0 translate-y-1/3': !openSubmenu,
                'md:translate-0 translate-y-10': openSubmenu,
              })}
            >
              {section === 'main' && (
                <div className="flex flex-col py-10 font-sans text-black/85">
                  <h2 className="pb-8 text-2xl font-light leading-4 md:pt-0 md:text-3xl">
                    Global Mangrove Watch
                  </h2>
                  <div className="flex flex-col items-start space-y-4 pb-10 text-2lg font-light">
                    <button onClick={() => section && setSection('about')}>About this tool</button>
                    <button onClick={() => section && setSection('news')}>News</button>
                  </div>
                  <div className="space-y-4 pb-6">
                    <p className="text-xs font-bold uppercase">Powered by</p>
                    <button onClick={handleOpenSubmenu} className="flex items-start space-x-4">
                      <p className="pb-3 text-left text-2lg font-light leading-3">
                        Global Mangrove Alliance
                      </p>
                      <Icon
                        icon={ARROW_SVG}
                        className={cn({
                          'h-3 w-3 stroke-current': true,
                          'rotate-180 transform': openSubmenu,
                          'rotate-0 transform': !openSubmenu,
                        })}
                      />
                    </button>
                  </div>
                  <AnimatePresence>
                    {openSubmenu && (
                      <motion.div
                        className="mb-4 flex flex-col space-y-4 md:mb-14"
                        initial="hidden"
                        animate="displayed"
                        variants={{
                          hidden: { opacity: 0 },
                          displayed: { opacity: 1 },
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex flex-col space-y-2 border-l pl-7 md:space-y-3">
                          {EXT_MENU_OPTIONS.map(({ id, label, href }) => (
                            <a
                              key={id}
                              className="cursor-pointer text-lg font-light md:text-2lg"
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {label}
                            </a>
                          ))}
                        </div>

                        <div className="grid w-full grid-cols-2 items-center justify-between md:grid-cols-4">
                          <Icon icon={ABERYSTWYTH_SVG} className="w-22 md:w-28" />
                          <Icon icon={SOLO_SVG} className="w-22 md:w-28" />
                          <Icon icon={WETLANDS_SVG} className="w-22 md:w-28" />
                          <Icon icon={NATURE_CONSERVANCY_SVG} className="w-22 md:w-28" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Media lessThan="md">
                    <Image alt="GMA" src={GMA_PNG as StaticImageData} width={100} height={50} />
                  </Media>
                  <Media greaterThanOrEqual="md">
                    <Image alt="GMA" src={GMA_PNG as StaticImageData} width={133} height={58} />
                  </Media>
                </div>
              )}
              <AnimatePresence>
                {section === 'about' && (
                  <motion.div
                    className="no-scrollbar overflow-y-auto font-sans"
                    initial="hidden"
                    animate="displayed"
                    variants={{
                      hidden: { opacity: 0 },
                      displayed: { opacity: 1 },
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <About />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {section === 'news' && (
                  <motion.div
                    className="no-scrollbar overflow-y-auto pt-3 font-sans"
                    initial="hidden"
                    animate="displayed"
                    variants={{
                      hidden: { opacity: 0 },
                      displayed: { opacity: 1 },
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <BlogContent />
                  </motion.div>
                )}
              </AnimatePresence>
              <DialogClose />
            </DialogContent>
          </Dialog>
        </div>
        <div className="block w-full text-center font-sans text-xxs text-white md:hidden">Menu</div>
      </Helper>
    </div>
  );
};

export default Menu;
