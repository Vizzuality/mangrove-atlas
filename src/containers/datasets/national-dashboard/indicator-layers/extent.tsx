import { numberFormat } from '@/lib/format';

import type { IndicatorExtentProps } from './types';

const LABEL_UNITS = {
  km2: 'km²',
};

const UNIT_ARIA = {
  km2: 'square kilometres',
};

const IndicatorExtent = ({ unit, dataSource }: IndicatorExtentProps) => {
  if (!dataSource?.value) {
    return (
      <div className="flex flex-col space-y-2">
        <h5 className="text-sm font-normal">Extent</h5>
      </div>
    );
  }
  const displayUnit = unit ? LABEL_UNITS[unit] || unit : '';
  const ariaUnit = unit ? UNIT_ARIA[unit] || unit : '';
  return (
    <div className="flex flex-col space-y-2">
      <h5 className="text-sm font-normal">Extent</h5>
      <span
        className="whitespace-nowrap"
        aria-label={`${numberFormat(dataSource.value)} ${ariaUnit}`.trim()}
      >
        <span className="notranslate">{numberFormat(dataSource.value)}</span>
        {displayUnit && <span> {displayUnit}</span>}
      </span>
    </div>
  );
};

export default IndicatorExtent;
