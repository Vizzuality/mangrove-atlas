import { ReactElement } from 'react';

export type DataResponse = {
  data: Data[];
  metadata: Metadata;
};

type Legend = {
  label: string;
  value: string | number;
  unit: string;
  color: string;
};

type TooltipData = {
  title?: string;
  content?: (properties: unknown) => JSX.Element | ReactElement;
  items?: ChartData[];
};

type chartBaseTypes = {
  pies: {
    value: string;
  };
};

type ChartConfig = {
  type: string;
  data: ChartData[];
  tooltip: TooltipData;
  cartesianGrid: boolean;
  chartBase: chartBaseTypes;
  onBrushEnd?: () => void;
  startIndex?: number;
  endIndex?: number;
};
