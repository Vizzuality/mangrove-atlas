import type { ScaleLinear } from 'd3-scale';
import type {
  CartesianGridProps,
  CartesianAxisProps,
  XAxisProps,
  YAxisProps,
} from 'recharts/types';
import type { LayoutType } from 'recharts/types/util/types';

export type ChartConfigProps = {
  data: unknown[];
  margin?: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  };
  type?: 'pie' | 'bar' | 'line' | 'composed';
  height?: number;
  width?: number;
  layout?: LayoutType;
  stackOffset?: 'sign' | 'expand' | 'none' | 'wiggle' | 'silhouette';
  tooltip?: unknown;
  cartesianGrid?: CartesianGridProps;
  cartesianAxis?: CartesianAxisProps;
  xAxis?: XAxisProps;
  yAxis?: YAxisProps;
  chartBase: {
    pies?: object;
    bars?: object;
    lines?: object;
    bar?: object;
  };
  xKey?: string;
  referenceLines?: unknown[];
  customBrush?: {
    margin?: { top: number; right: number; bottom: number; left: number };
    startIndex?: number;
    endIndex?: number;
  };
  patterns?: unknown;
  gradients: unknown;
  onBrushEnd: (args: { startIndex: number; endIndex: number }) => void;
  startIndex: number;
  endIndex: number;
  dataKey: DataKey<any>;
};

// BRUSH types
export type Point = [number, number];
export type Box = [Point, Point];
export type BrushType = '2d' | 'x' | 'y';

export type SVGBrushEvent = {
  target: null;
  type: 'start' | 'brush' | 'end';
  selection: Box | null;
  sourceEvent: React.PointerEvent<SVGElement>;
};

export type SVGBrushProps = {
  animate?: boolean;
  selection?: Box | null;
  extent: Box;
  minimumGap?: number;
  maximumGap?: number;
  onBrushStart?: (event: SVGBrushEvent) => void;
  onBrush?: (event: SVGBrushEvent) => void;
  onBrushEnd?: (event: SVGBrushEvent) => void;
  getEventMouse?: (event: React.PointerEvent<SVGElement>) => Point;
  brushType?: BrushType;
  scale: ScaleLinear<number, number>;
  shadowFilterId: string;
};

export type Margin = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

type BrushEndPayload = {
  startIndex: number;
  endIndex: number;
};

type BrushProps<T = unknown> = {
  width?: number | string;
  height?: number | string;
  startIndex?: number;
  endIndex?: number;
  margin?: Partial<Margin>;
  data: T[];
  minimumGap?: number;
  maximumGap?: number;
  onBrushEnd?: (payload: BrushEndPayload) => void;
};
