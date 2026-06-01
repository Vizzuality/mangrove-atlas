'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ErrorPage from 'components/error-page';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      code="500"
      title="Something went wrong"
      message="An unexpected error occurred on our end. Try again, or head back to the map."
    >
      <Button size="lg" onClick={reset}>
        Try again
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link href="/">Back to the map</Link>
      </Button>
    </ErrorPage>
  );
}
