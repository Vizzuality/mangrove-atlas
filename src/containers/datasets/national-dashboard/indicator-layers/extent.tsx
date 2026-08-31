import { numberFormat } from '@/lib/format';

import type { IndicatorExtentProps } from './types';

const LABEL_UNITS = {
  km2: 'km²',
};

const UNIT_ARIA = {
  km2: 'square kilometres',
};

const IndicatorExtent = ({ unit, dataSource }: IndicatorExtentProps) => {
  // No extent (missing or 0): omit the cell entirely. The row grid's 1fr extent
  // column absorbs the gap and the controls cell keeps hugging the right edge.
  if (!dataSource?.value) {
    return null;
  }
  const displayUnit = unit ? LABEL_UNITS[unit] || unit : '';
  const ariaUnit = unit ? UNIT_ARIA[unit] || unit : '';
  return (
    <span
      role="cell"
      className="whitespace-nowrap"
      aria-label={`${numberFormat(dataSource.value)} ${ariaUnit}`.trim()}
    >
      <span className="notranslate">{numberFormat(dataSource.value)}</span>
      {displayUnit && <span> {displayUnit}</span>}
    </span>
  );
};

export default IndicatorExtent;
