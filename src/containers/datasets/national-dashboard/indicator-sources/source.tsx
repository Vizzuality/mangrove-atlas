import type { IndicatorSourceTypes } from './types';

const IndicatorSource = ({ source, color }: IndicatorSourceTypes) => (
  <div className="flex max-w-[100px] flex-col space-y-2">
    <h5 className="text-sm font-normal">Source</h5>
    <div className="flex w-full items-start space-x-2">
      <div style={{ backgroundColor: color }} className="mt-1 h-4 w-2 shrink-0 rounded-md pt-4" />
      <span className="max-w-[180px]">{source}</span>
    </div>
  </div>
);

export default IndicatorSource;
