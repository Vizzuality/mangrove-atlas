import cn from '@/lib/classnames';

import { WIDGETS } from '@/containers/datasets';
import WidgetWrapper from '@/containers/widget';
import { useIsWidgetDisabledOffline } from '@/containers/widgets/hooks';

import type { WidgetTypes } from 'types/widget';

type Props = {
  widget: WidgetTypes & { index?: number };
};

export default function WidgetCard({ widget }: Props) {
  const { slug, name, applicability, contextualLayers, index } = widget;
  const Widget = WIDGETS[slug];
  const isDisabledOffline = useIsWidgetDisabledOffline(slug);
  if (!Widget) return null;
  return (
    <div
      className={cn(isDisabledOffline && 'pointer-events-none opacity-40')}
      aria-disabled={isDisabledOffline || undefined}
      title={isDisabledOffline ? 'Unavailable offline' : undefined}
    >
      <WidgetWrapper
        title={name}
        id={slug}
        applicability={applicability}
        contextualLayers={contextualLayers}
        index={index}
      >
        <Widget />
      </WidgetWrapper>
    </div>
  );
}
