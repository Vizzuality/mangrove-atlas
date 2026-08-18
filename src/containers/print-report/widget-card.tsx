'use client';

import { ReactNode, useCallback, useState } from 'react';

import cn from '@/lib/classnames';

import { WIDGET_SUBTITLE_STYLE } from '@/styles/widgets';

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
  applicability,
  children,
  fullWidth = false,
}: {
  name: string;
  applicability?: string;
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
          'break-inside-avoid overflow-hidden rounded-[20px] border border-black/10 bg-white p-6 print:overflow-visible',
          fullWidth && 'col-span-2',
          isEmpty && 'hidden'
        )}
      >
        <h2 className={cn(WIDGET_SUBTITLE_STYLE, 'mb-2 text-black/85')}>{name}</h2>
        {applicability && (
          // The app pairs this with a "Learn more" dialog; a printed page has
          // nowhere to open it, so the report keeps the line and drops the link.
          <p className="mb-4 text-sm text-black/85">
            <span className="font-semibold">Data applicability:</span>{' '}
            <span className="font-light">{applicability}.</span>
          </p>
        )}
        {children}
      </div>
    </ReportNoDataProvider>
  );
};

export default PrintWidgetCard;
