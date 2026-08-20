'use client';

import { createContext, useContext, useEffect } from 'react';

/**
 * Lets a widget tell the report it is currently rendering an empty state, so
 * the report can drop the card — a printed page should not carry "no data for
 * this location" placeholders.
 *
 * The signal is raised on mount and withdrawn on unmount, because several
 * widgets render their empty state while the query is still in flight
 * (`if (!data) return <NoData />`). A one-way flag would permanently hide a
 * card whose data merely arrived late.
 *
 * Outside the print report there is no provider and the hook is a no-op, so
 * the widgets behave exactly as before in the app sidebar.
 */
const ReportNoDataContext = createContext<((isEmpty: boolean) => void) | null>(null);

export const ReportNoDataProvider = ReportNoDataContext.Provider;

export function useReportNoData() {
  const report = useContext(ReportNoDataContext);

  useEffect(() => {
    report?.(true);
    return () => report?.(false);
  }, [report]);
}
