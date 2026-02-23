import { useState } from 'react';

import cn from '@/lib/classnames';

import { motion, AnimatePresence } from 'motion/react';

import Helper from '@/containers/help/helper';
import About from '@/containers/navigation/menu/about';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

import MENU_SVG from '@/svgs/tools-bar/menu.svg?sprite';
import MainMenu from './main';
import Profile from './profile';

const Menu = () => {
  const [section, setSection] = useState('main');

  return (
    <Dialog>
      <Helper
        className={{
          button: '-right-4 -top-2',
          tooltip: 'w-fit-content max-w-[400px]',
        }}
        tooltipPosition={{ top: -40, left: 0 }}
        message="Find more information about the Global Mangrove Watch, the Global Mangrove Alliance, and our associated resources, trainings, and guidance documents"
      >
        <DialogTrigger asChild>
          <button
            data-testid="menu-button"
            type="button"
            onClick={() => setSection('main')}
            className="flex h-full items-center space-x-2"
          >
            <Icon icon={MENU_SVG} className="h-6 w-6" description="Menu" />
            <span className="font-sans text-sm text-white">Menu</span>
          </button>
        </DialogTrigger>
      </Helper>

      <DialogContent
        data-testid="menu-content"
        className={cn({
          'max-w-135 font-sans md:mb-20': true,
          'h-fit py-0': section === 'main',
        })}
      >
        {section === 'main' && (
          <div className="py-10">
            <div className="flex w-full flex-col space-y-4 font-sans text-black/85">
              <DialogTitle className="text-2xl font-light leading-4 md:pt-0 md:text-3xl">
                Global Mangrove Watch
              </DialogTitle>
              <MainMenu setSection={setSection} />
            </div>
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
          {section === 'profile' && (
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
              <Profile />
            </motion.div>
          )}
        </AnimatePresence>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default Menu;
