import { useCallback, useState } from 'react';

import Image, { StaticImageData } from 'next/image';

import cn from 'lib/classnames';

import { AnimatePresence, motion } from 'framer-motion';

import BlogContent from 'containers/blog/content';
import { EXT_MENU_OPTIONS, STYLES } from 'containers/sidebar/constants';
import About from 'containers/sidebar/menu/about';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import GMA_PNG from 'images/gma.png';

import MENU_SVG from 'svgs/sidebar/menu.svg?sprite';
import ARROW_SVG from 'svgs/ui/arrow.svg?sprite';

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
          <DialogContent
            className={cn({
              'scroll-y top-[2%] rounded-3xl px-10 font-sans md:top-[5vh] md:max-w-xl': true,
              'h-fit py-0': section === 'main',
              'h-[96%] pt-10 pb-0 md:h-[90vh] md:py-0': section === 'news' || section === 'about',
            })}
          >
            {section === 'main' && (
              <div className="flex flex-col py-10 font-sans text-black/85">
                <h2 className="pb-8 pt-10 text-2xl font-light md:pt-0 md:text-3xl">
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
                      className="mb-14 flex flex-col space-y-3 border-l pl-7"
                      initial="hidden"
                      animate="displayed"
                      variants={{
                        hidden: { opacity: 0 },
                        displayed: { opacity: 1 },
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {EXT_MENU_OPTIONS.map(({ id, label, href }) => (
                        <a
                          key={id}
                          className="cursor-pointer text-2lg font-light"
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Image alt="GMA" src={GMA_PNG as StaticImageData} width={133} height={58} />
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
    </div>
  );
};

export default Menu;
