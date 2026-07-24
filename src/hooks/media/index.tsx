import { useEffect, useState } from 'react';

export const useScreenWidth = () => {
  // Lazy init reads the real width on the client's first render (0 during SSR),
  // and the mount effect below re-syncs after hydration. Without this the width
  // stayed 0 until the first resize event, so any `width < breakpoint` check
  // read as mobile on load regardless of the actual viewport.
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 0 : window.innerWidth));

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};
