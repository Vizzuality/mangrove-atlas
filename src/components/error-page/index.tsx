import type { ReactNode } from 'react';

import Logo from 'components/logo';

type ErrorPageProps = {
  code: string;
  title: string;
  message: string;
  children: ReactNode;
};

const ErrorPage = ({ code, title, message, children }: ErrorPageProps) => {
  return (
    // id="main-content" is the target of the root layout's skip link, which is
    // rendered on every route.
    <main
      id="main-content"
      className="relative flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center"
    >
      <Logo position="top-left" width={360} />

      <p className="text-brand-800 font-sans text-[120px] leading-none font-light">{code}</p>
      <h1 className="text-brand-800 mt-2 font-sans text-3xl font-light">{title}</h1>
      <p className="text-grey-600 mt-4 max-w-md text-sm leading-relaxed">{message}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{children}</div>
    </main>
  );
};

export default ErrorPage;
