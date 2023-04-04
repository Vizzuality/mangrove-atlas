import cn from 'lib/classnames';

import Icon from 'components/icon';
import { LegendItemButtonProps } from 'components/map/legend/types';

export const LegendItemButton = ({ icon, className, selected = false }: LegendItemButtonProps) => {
  return (
    <div
      className={cn({
        'group relative': true,
        [className]: !!className,
      })}
    >
      <Icon
        className={cn({
          'text-navy-500 relative z-10 flex h-5 w-5 items-center justify-center rounded-full transition-colors':
            true,
          'group-hover:text-navy-400 group-active:text-navy-500': true,
        })}
        icon={icon}
      />
      <span
        className={cn({
          'absolute top-1/2 left-1/2 z-0 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full border border-transparent transition-all':
            true,
          'group-active:bg-navy-200 group-active:scale-100': true,
          'border-navy-500 group-hover:border-navy-200 scale-100': selected,
        })}
      />
    </div>
  );
};

export default LegendItemButton;
