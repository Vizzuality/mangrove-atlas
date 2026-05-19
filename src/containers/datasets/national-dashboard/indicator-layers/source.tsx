import type { IndicatorSourceProps } from './types';

const IndicatorSource = ({ source, color }: IndicatorSourceProps) => (
  <div className="flex w-full items-start space-x-2" aria-label={source}>
    <div
      style={{ backgroundColor: color }}
      className="mt-1 h-4 w-2 shrink-0 rounded-md"
      aria-hidden="true"
    />
    <span className="truncate" title={source}>
      {source}
    </span>
  </div>
);

export default IndicatorSource;
