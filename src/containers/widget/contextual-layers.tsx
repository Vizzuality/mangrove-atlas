import { FC } from 'react';

import ContextualLayersComponent from 'components/contextual-layers';

import { useGetContextualLayerInfo } from 'containers/layers/hooks';
import { WidgetSlugType } from 'types/widget';

type ContextualLayersWrapperProps = {
  id: string;
  origin?: WidgetSlugType;
  description: string;
};

const ContextualLayersWrapper: FC<ContextualLayersWrapperProps> = ({ id, description, origin }) => {
  const data = useGetContextualLayerInfo(id);
  return (
    <ContextualLayersComponent
      origin={origin}
      name={data.name || ''}
      thumbSource={data.thumbSource}
      id={id}
      description={description}
    />
  );
};

export default ContextualLayersWrapper;
