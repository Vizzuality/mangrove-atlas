import { useState } from 'react';

import Image, { StaticImageData } from 'next/image';

import cn from 'lib/classnames';

import { AnimatePresence, motion } from 'framer-motion';

import Helper from 'containers/guide/helper';
import About from 'containers/navigation/menu/about';
import BlogContent from 'containers/news/content';

import { Dialog, DialogContent, DialogClose, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';
import { Media } from 'components/media-query';

import GMA_PNG from 'images/gma.png';

import ABERYSTWYTH_SVG from 'svgs/partners/aberystwyth.svg?sprite';
import NATURE_CONSERVANCY_SVG from 'svgs/partners/nature.svg?sprite';
import SOLO_SVG from 'svgs/partners/solo.svg?sprite';
import WETLANDS_SVG from 'svgs/partners/wetlands.svg?sprite';
import MENU_SVG from 'svgs/tools-bar/menu.svg?sprite';

const Menu = () => {
  const [section, setSection] = useState('main');

  return (
    <Dialog>
      <Helper
        className={{
          button: '-top-2 -right-4',
          tooltip: 'w-fit-content',
        }}
        theme="dark"
        tooltipPosition={{ top: -40, left: 0 }}
        message="main menu"
      >
        <DialogTrigger asChild>
          <button
            data-testid="menu-button"
            type="button"
            onClick={() => setSection('main')}
            className="flex items-center space-x-2"
          >
            <Icon icon={MENU_SVG} className="h-7 w-7" description="Menu" />
            <span className="font-sans text-sm text-white">Menu</span>
          </button>
        </DialogTrigger>
      </Helper>

      <DialogContent
        data-testid="menu-content"
        className={cn({
          'min-w-[540px] font-sans md:mb-20': true,
          'h-fit py-0': section === 'main',
        })}
      >
        {section === 'main' && (
          <div className="flex w-full flex-col py-10 font-sans text-black/85">
            <h2 className="pb-8 text-2xl font-light leading-4 md:pt-0 md:text-3xl">
              Global Mangrove Watch
            </h2>
            <div className="flex flex-col items-start space-y-4 pb-10 text-2lg font-light">
              <button onClick={() => section && setSection('about')}>About this tool</button>
            </div>
            <div className="space-y-4 pb-6">
              <p className="text-xs font-bold uppercase">Powered by</p>
              <a
                href="https://www.mangrovealliance.org/"
                className="pb-3 text-left text-2lg font-light leading-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                Global Mangrove Alliance
              </a>
            </div>

            <div className="grid grid-cols-2 items-center py-6">
              <Icon icon={ABERYSTWYTH_SVG} className="w-22 md:w-28" description="ABERYSTWYTH" />
              <Icon icon={SOLO_SVG} className="w-22 md:w-28" description="SOLO" />
              <Icon icon={WETLANDS_SVG} className="w-22 md:w-28" description="Wetlands" />
              <Icon
                icon={NATURE_CONSERVANCY_SVG}
                className="w-22 md:w-28"
                description="NATURE_CONSERVANCY"
              />
            </div>

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
        {process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' && (
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
        )}
        <DialogClose className="md:fixed md:!top-18 md:left-[595px]" />
      </DialogContent>
    </Dialog>
  );
};

export default Menu;
