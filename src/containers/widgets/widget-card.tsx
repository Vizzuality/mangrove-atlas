import { FC, memo } from 'react';

import { WIDGETS } from '@/containers/datasets';
import WidgetWrapper from '@/containers/widget';

import { WidgetTypes } from 'types/widget';

type Props = {
  widget: WidgetTypes & { index?: number };
};

const WidgetCard: FC<Props> = ({ widget }) => {
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
};

export default memo(WidgetCard);
