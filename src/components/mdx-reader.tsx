import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

import { MDXProvider } from '@mdx-js/react';

function A(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = typeof props.href === 'string' && /^https?:\/\//.test(props.href);

  return (
    <a
      {...props}
      target={isExternal ? '_blank' : props.target}
      rel={isExternal ? 'noopener noreferrer' : props.rel}
    />
  );
}

export default function LayoutMdx({ children }: PropsWithChildren) {
  return <MDXProvider components={{ a: A }}>{children}</MDXProvider>;
}
