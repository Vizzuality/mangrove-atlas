import Link from 'next/link';

import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import ErrorPage from 'components/error-page';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Page not found"
      message="We couldn't find the page you were looking for. It may have been moved or no longer exists."
    >
      <Button asChild size="lg">
        <Link href="/">Back to the map</Link>
      </Button>
    </ErrorPage>
  );
}
