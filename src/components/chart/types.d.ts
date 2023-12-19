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
  customBrush?: Element;
  patterns?: unknown;
  gradients: unknown;
  onBrushEnd: (args: { startIndex: number; endIndex: number }) => void;
  startIndex: number;
  endIndex: number;
  dataKey: DataKey<any>;
};
