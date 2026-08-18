'use client';

import { ReactNode, useCallback, useState } from 'react';

import cn from '@/lib/classnames';

import { ReportNoDataProvider } from './no-data-context';

/**
 * A single widget card in the report. Collapses while the widget inside is
 * rendering an empty state, so locations without data for an indicator drop it
 * from the printed report instead of printing a placeholder.
 *
 * The card hides with `display: none` rather than unmounting: unmounting would
 * take the widget's empty state down with it, which withdraws the signal and
 * brings the card straight back.
 */
const PrintWidgetCard = ({
  name,
  children,
  fullWidth = false,
}: {
  name: string;
  children: ReactNode;
  fullWidth?: boolean;
}) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const reportNoData = useCallback((empty: boolean) => setIsEmpty(empty), []);

  return (
    <ReportNoDataProvider value={reportNoData}>
      <div
        // No height cap in print: a cap clips the taller widgets (the alerts
        // chart loses its axis) and clipped output is worse than a card that
        // spills onto the next page.
        className={cn(
          'break-inside-avoid overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm print:overflow-visible print:shadow-none',
          fullWidth && 'col-span-2',
          isEmpty && 'hidden'
        )}
      >
        <h2 className="mb-3 text-xs font-semibold tracking-wider text-black/60 uppercase">
          {name}
        </h2>
        {children}
      </div>
    </ReportNoDataProvider>
  );
};

export default PrintWidgetCard;
