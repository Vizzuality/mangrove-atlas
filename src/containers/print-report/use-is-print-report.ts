'use client';

import { usePathname } from 'next/navigation';

/**
 * True while rendering inside the `/print-report` route, so widgets can drop
 * interactive chrome (timelines, pickers) that means nothing on paper.
 */
export default function useIsPrintReport() {
  const pathname = usePathname();
  return !!pathname?.startsWith('/print-report');
}
