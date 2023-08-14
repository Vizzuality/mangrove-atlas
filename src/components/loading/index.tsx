import { FC } from 'react';

import cn from 'lib/classnames';

import cx from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

import Icon from 'components/icon';

import LOADING_SVG from 'svgs/ui/loading.svg?sprite';

import type { LoadingProps } from './types';
export const Loading: FC<LoadingProps> = ({
  visible = false,
  className,
  iconClassName = 'w-12 h-12x',
  transition = {},
}: LoadingProps) => {
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  if (!visible) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="loading"
        {...variants}
        transition={transition}
        className={cx({
          'opacity-50': true,
          [className]: !!className,
        })}
      >
        <Icon
          icon={LOADING_SVG}
          className={cn({
            ' text-brand-400 opacity-50': true,
            [iconClassName]: !!iconClassName,
          })}
          description="Loading..."
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Loading;
