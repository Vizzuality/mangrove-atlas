import { numberFormat } from 'lib/format';

import type { IndicatorExtentTypes } from './types';

const LABEL_UNITS = {
  km2: 'km²',
};

const IndicatorExtent = ({ unit, dataSource }: IndicatorExtentTypes) => (
  <div className="flex flex-col space-y-2">
    <h5 className="text-sm font-normal">Extent</h5>
    {dataSource?.value && (
      <span className="whitespace-nowrap">
        {numberFormat(dataSource.value)}
        {unit && <span> {LABEL_UNITS[unit] || unit}</span>}
      </span>
    )}
  </div>
);

export default IndicatorExtent;
