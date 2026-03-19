import cn from '@/lib/classnames';

import { decode } from 'html-entities';

type LayoutMdxProps = {
  children: React.ReactNode;
  className?: string;
};

const LayoutMdx: React.FC<LayoutMdxProps> = (props: LayoutMdxProps) => {
  const { children, className } = props;
  console.log({ children }, 'MDX content'); // Debug log to check the content being passed

  const decoded = typeof children === 'string' ? decode(children) : children;
  return (
    <article
      className={cn(
        'prose:overflow-y-hidden prose:font-sans prose-a:text-decoration-none prose prose-h1:text-3xl prose-h1:font-light prose-h1:leading-12.5 prose-h1:text-[rgba(0,0,0,.85)] prose-h2:text-sm prose-h2:font-semibold prose-a:font-semibold prose-a:text-[#00857f] prose-a:decoration-transparent',
        className
      )}
    >
      {/* Content */}
      {decoded}
    </article>
  );
};

export default LayoutMdx;
