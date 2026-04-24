'use client';

import { useWindowSize } from 'usehooks-ts';

import DesktopLayout from '@/layouts/desktop';
import MobileLayout from '@/layouts/mobile';

import { breakpoints } from '@/styles/styles.config';

export default function MainApp() {
  const { width: screenWidth } = useWindowSize();

  return (
    <>
      {screenWidth >= breakpoints.md && <DesktopLayout />}
      {screenWidth < breakpoints.md && <MobileLayout />}
    </>
  );
}
