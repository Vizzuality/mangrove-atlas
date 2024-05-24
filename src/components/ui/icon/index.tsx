import cx from 'clsx';

import type { IconProps } from './types';

export const Icon = ({ icon, className = 'w-5 h-5', style, description }: IconProps) => (
  <svg
    role="img"
    className={cx({
      'fill-current': true,
      [className]: className,
    })}
    viewBox={icon?.viewBox || '0 0 32 32'}
    style={style}
    aria-labelledby={`icon-title-${description}-${icon.id}`}
  >
    <title id={`icon-title-${description}-${icon.id}`}>{description}</title>
    <use xlinkHref={`#${icon?.id}`} aria-hidden="true" />
  </svg>
);

export default Icon;
