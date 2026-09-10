'use client';

import { useReportNoData } from './no-data-context';

/**
 * Renders nothing and tells the report to drop this widget's card. Use it for
 * widgets that have nothing to say on paper — e.g. a picker with no selection.
 */
export default function OmitFromReport() {
  useReportNoData();
  return null;
}
