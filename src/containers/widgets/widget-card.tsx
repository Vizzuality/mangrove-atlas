import { WIDGETS } from '@/containers/datasets';
import WidgetWrapper from '@/containers/widget';

import type { WidgetTypes } from 'types/widget';

type Props = {
  widget: WidgetTypes & { index?: number };
};

export default function WidgetCard({ widget }: Props) {
  const { slug, name, applicability, contextualLayers, index } = widget;
  const Widget = WIDGETS[slug];
  if (!Widget) return null;
  return (
    <WidgetWrapper
      title={name}
      id={slug}
      applicability={applicability}
      contextualLayers={contextualLayers}
      index={index}
    >
      <Widget />
    </WidgetWrapper>
  );
}
