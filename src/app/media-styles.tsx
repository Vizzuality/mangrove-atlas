'use client';

import { mediaStyles } from '@/components/media-query';

export function MediaStylesTag() {
  return <style type="text/css" dangerouslySetInnerHTML={{ __html: mediaStyles }} />;
}
