import type { ViewState, MapProps, MapboxMap } from 'react-map-gl';

export interface CustomMapProps extends MapProps {
  /** A function that returns the map instance */
  children?: (map: MapboxMap) => React.ReactNode;

  /** Custom css class for styling */
  className?: string;

  /** An string that defines the rotation axis */
  constrainedAxis?: 'x' | 'y';

  /** URL-synced bbox — used only as the initial view on mount */
  defaultBbox?: number[][] | null;

  /** Fired on every map move — caller is responsible for debouncing */
  onMapMove?: () => void;
}
