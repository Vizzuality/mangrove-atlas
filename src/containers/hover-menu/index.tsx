/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useCallback, useState } from 'react';

import cn from 'lib/classnames';

import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

import Icon from 'components/icon';

import { WIDGET_OPTIONS } from './constants';

interface HoverMenuProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: (boolean) => void;
}
const HoverMenu = ({ className, isOpen, setIsOpen }: HoverMenuProps) => {
  const [category, setCategory] = useState(WIDGET_OPTIONS[0].id);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const menuVariants = {
    initial: { x: -400 },
    animate: {
      x: 0,
      transition: {
        duration: 0.25,
        delay: 0.125,
        ease: 'easeOut',
      },
    },
    exit: {
      x: -400,
      transition: {
        duration: 0.25,
        delay: 0,
        ease: 'easeOut',
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
          className="absolute top-0 left-0 z-10 h-screen w-screen bg-black/50"
          onClick={handleClose}
        />
      )}
      {isOpen && (
        <motion.div
          key="menu"
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute left-2 z-20 h-full shadow-lg"
          variants={menuVariants}
        >
          <div
            className={cx({
              'text-black/85 fixed z-20 space-y-4 rounded-[30px] bg-white p-1.5 pr-4 font-sans text-[19px] font-light focus:outline-none':
                true,
              [className]: !!className,
            })}
            onMouseLeave={() => setIsOpen(false)}
          >
            {WIDGET_OPTIONS.map(({ id, label, icon }) => (
              <button
                key={id}
                className="flex cursor-pointer items-center space-x-3"
                onClick={() => setCategory(id)}
              >
                <div
                  className={cn({
                    'flex h-12 w-12 items-center justify-center rounded-full bg-white': true,
                    'bg-brand-800': category === id,
                  })}
                >
                  <Icon
                    icon={icon}
                    className={cn({
                      'h-8 w-8 stroke-none': true,
                      'fill-white': category === id,
                      'fill-brand-800': category !== id,
                    })}
                  />
                </div>
                <p className="whitespace-nowrap">{label}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HoverMenu;
