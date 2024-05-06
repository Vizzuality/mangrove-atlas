import { useEffect } from 'react';

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

export const DrawControl = (props: DrawControlProps) => {
  const drawRef = useControl<MapboxDraw>(
    () =>
      new MapboxDraw({
        ...DEFAULT_PROPS,
        ...props,
      }),
    ({ map }) => {
      props.onCreate && map.on('draw.create', props.onCreate);
      props.onUpdate && map.on('draw.update', props.onUpdate);
      props.onDelete && map.on('draw.delete', props.onDelete);
      props.onModeChange && map.on('draw.modechange', props.onModeChange);
    },
    ({ map }) => {
      props.onCreate && map.on('draw.create', props.onCreate);
      props.onUpdate && map.on('draw.update', props.onUpdate);
      props.onDelete && map.on('draw.delete', props.onDelete);
      props.onModeChange && map.on('draw.modechange', props.onModeChange);
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
    if (!drawRef) return null;

    if (customPolygon) {
      try {
        drawRef.add(customPolygon);
      } catch (error) {
        console.error('Error adding custom polygon:', error);
        onError?.('Error adding custom polygon:', error);
      }

      if (onSetCustomPolygon) {
        onSetCustomPolygon(customPolygon);
      }
    }
  }, [onSetCustomPolygon, customPolygon, drawRef, onError]);

  return null;
};

DrawControl.displayName = 'DrawControl';

export default DrawControl;
