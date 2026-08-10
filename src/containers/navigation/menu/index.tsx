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

import MENU_SVG from '@/svgs/tools-bar/menu';

import MainMenu from './main';
import Profile from './profile';

const Menu = ({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) => {
  const [section, setSection] = useState('main');

  return (
    <Dialog>
      {variant === 'mobile' ? (
        <DialogTrigger asChild>
          <button
            data-testid="menu-button-mobile"
            type="button"
            onClick={() => setSection('main')}
            aria-label="Menu"
            className="flex w-14 cursor-pointer flex-col items-center justify-center space-y-1 text-white transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MENU_SVG className="h-8 w-8 fill-current text-white" aria-hidden="true" />
            <span className="text-xxs font-sans leading-none text-white">Menu</span>
          </button>
        </DialogTrigger>
      ) : (
        <Helper
          className={{
            button: '-top-2 -right-4',
            tooltip: 'w-fit-content max-w-100',
          }}
          tooltipPosition={{ top: -40, left: 0 }}
          message="Find more information about the Global Mangrove Watch, the Global Mangrove Alliance, and our associated resources, trainings, and guidance documents"
        >
          <DialogTrigger asChild>
            <button
              data-testid="menu-button"
              type="button"
              onClick={() => setSection('main')}
              className="flex h-full cursor-pointer items-center space-x-2"
            >
              <MENU_SVG className="h-6 w-6 fill-current" aria-hidden="true" />
              <span className="font-sans text-sm text-white">Menu</span>
            </button>
          </DialogTrigger>
        </Helper>
      )}

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
              <DialogTitle className="text-2xl leading-4 font-light md:pt-0 md:text-3xl">
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
