import { CONTEXTUAL_LAYERS_INFO } from '@/containers/layers/constants';

export const useGetContextualLayerInfo = (id: string) =>
  CONTEXTUAL_LAYERS_INFO.find((layer) => layer.id === id);
