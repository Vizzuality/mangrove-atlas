import { Layer } from '@deck.gl/core/typed';

// export type LayerProps<S> = {
//   id?: string;
//   beforeId?: string;
//   zIndex?: number;
//   settings?: Partial<S>;
// };

export type LayerProps = {
  id?: string;
  beforeId?: string;
  zIndex?: number;
  // settings?: Partial<S>;
};

export type MapboxLayerProps<T> = Partial<Omit<T, 'id'>> & {
  type: typeof Layer;
};

// export type DeckLayerProps<T, S> = LayerProps<S> &
//   T & {
//     type: typeof Layer;
//   };

export type DeckLayerProps<T, S> = LayerProps &
  T & {
    type: typeof Layer;
  };
