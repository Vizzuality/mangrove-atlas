import cn from '@/lib/classnames';

import { WIDGET_SUBTITLE_STYLE } from 'styles/widgets';

import type { OtherResource } from '../types';

import Resources from './resources';

const OtherResources = ({ resources }: { resources: OtherResource[] }) => (
  <section className="space-y-2 py-6.25 text-sm">
    <h3 className={cn(WIDGET_SUBTITLE_STYLE, 'py-2 font-normal')}>Other resources</h3>
    {resources.map((resource) => (
      <Resources key={resource.link} {...resource} />
    ))}
  </section>
);

export default OtherResources;
