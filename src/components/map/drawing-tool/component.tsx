import { useEffect, useRef } from 'react';

import { ControlPosition, useControl } from 'react-map-gl';

import MapboxDraw, { DrawModeChangeEvent } from '@mapbox/mapbox-gl-draw';

import DRAWING_STYLES from './styles';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

export type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  onCreate?: (event: { features: GeoJSON.Feature[] }) => void;
  onUpdate?: (event: { features: GeoJSON.Feature[]; action: string }) => void;
  onDelete?: (event: { features: GeoJSON.Feature[] }) => void;
  onModeChange?: (event: DrawModeChangeEvent) => void;
  displayControlsDefault?: boolean;
  customPolygon?: GeoJSON.FeatureCollection;
  onSetCustomPolygon?: (customPolygon) => void;
  styles?: typeof DRAWING_STYLES;
  onError?: (message: string, error: Error) => void;
};

const DEFAULT_PROPS: Partial<DrawControlProps> = {
  displayControlsDefault: false,
  styles: DRAWING_STYLES,
};

type DrawHandlers = Partial<
  Pick<DrawControlProps, 'onCreate' | 'onUpdate' | 'onDelete' | 'onModeChange'>
>;

const DrawControl = (props: DrawControlProps) => {
  // useControl runs its add/remove callbacks once, so map listeners must not
  // capture the handlers from the first render. Route them through a ref so
  // the latest props always run, and register stable wrappers we can `off`.
  const handlersRef = useRef<DrawHandlers>({});
  const { onCreate, onUpdate, onDelete, onModeChange } = props;
  useEffect(() => {
    handlersRef.current = { onCreate, onUpdate, onDelete, onModeChange };
  }, [onCreate, onUpdate, onDelete, onModeChange]);

  const listenersRef = useRef({
    'draw.create': (e) => handlersRef.current.onCreate?.(e),
    'draw.update': (e) => handlersRef.current.onUpdate?.(e),
    'draw.delete': (e) => handlersRef.current.onDelete?.(e),
    'draw.modechange': (e) => handlersRef.current.onModeChange?.(e),
  });

  const drawRef = useControl<MapboxDraw>(
    () =>
      new MapboxDraw({
        ...DEFAULT_PROPS,
        ...props,
      }),
    ({ map }) => {
      Object.entries(listenersRef.current).forEach(([type, listener]) => map.on(type, listener));
    },
    ({ map }) => {
      Object.entries(listenersRef.current).forEach(([type, listener]) => map.off(type, listener));
    },
    {
      position: props.position,
    }
  );

  const { onSetCustomPolygon, customPolygon, onError } = props;

  useEffect(() => {
    if (!customPolygon) {
      drawRef.changeMode('draw_polygon');
    }
  }, [drawRef, customPolygon]);

  useEffect(() => {
    if (!drawRef || !customPolygon) return;

    // Polygons that came from this control (draw.create / draw.update) are
    // already in it. Re-adding them would kick the user out of vertex
    // editing, and re-fitting would zoom on every drag. Only add + frame
    // geometry that is new to the control (upload, restore after remount).
    const alreadyDrawn =
      customPolygon.features.length > 0 &&
      customPolygon.features.every((f) => f.id !== undefined && !!drawRef.get(String(f.id)));
    if (alreadyDrawn) return;

    try {
      drawRef.add(customPolygon);
    } catch (error) {
      console.error('Error adding custom polygon:', error);
      onError?.('Error adding custom polygon:', error);
    }

    onSetCustomPolygon?.(customPolygon);
  }, [onSetCustomPolygon, customPolygon, drawRef, onError]);

  return null;
};

DrawControl.displayName = 'DrawControl';

export default DrawControl;
