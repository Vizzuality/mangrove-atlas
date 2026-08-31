import type { IndicatorSourceProps } from './types';

const IndicatorSource = ({ source, color }: IndicatorSourceProps) => (
  <div role="cell" className="flex w-full items-center space-x-2.5" aria-label={source}>
    <div
      style={{ backgroundColor: color }}
      className="h-4 w-2 shrink-0 rounded-sm"
      aria-hidden="true"
    />
    <span className="truncate" title={source}>
      {source}
    </span>
  </div>
);

export default IndicatorSource;
