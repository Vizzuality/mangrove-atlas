import cn from '@/lib/classnames';

describe('cn', () => {
  it('merges class names and drops falsy values', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('resolves conflicting tailwind classes via twMerge', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
