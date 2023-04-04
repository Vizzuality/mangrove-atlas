import cx from 'classnames';
import { twMerge } from 'tailwind-merge';
import { ClassNameValue } from 'tailwind-merge/dist/lib/tw-join';

export default function cn(classNames: Record<string, boolean>): string {
  const c = cx(classNames) as ClassNameValue;
  return twMerge(c);
}
