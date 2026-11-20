import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { analysisAtom } from '@/store/analysis';
import { customAreaNameAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { printReportStatusAtom } from '@/store/print-report';

import { useIsFetching } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';

import { useSyncLocation } from 'hooks/use-sync-location';

import { PRINT_REPORT_PARAM, loadPrintReportArea } from './storage';

/**
 * Quiet period with no queries in flight before widgets count as loaded. Also covers the
 * Recharts mount animation (1.5s by default), so snapshots don't catch half-drawn charts.
 */
const SETTLE_MS = 1600;

/** Restores the custom area handed over by the opener tab (see `storage.ts`). */
export const useRestorePrintReportArea = () => {
  const searchParams = useSearchParams();
  const reportId = searchParams.get(PRINT_REPORT_PARAM);
  const { type } = useSyncLocation();
  const [status, setStatus] = useAtom(printReportStatusAtom);
  const setUploadTool = useSetAtom(drawingUploadToolAtom);
  const setAnalysis = useSetAtom(analysisAtom);
  const setCustomAreaName = useSetAtom(customAreaNameAtom);

  useEffect(() => {
    if (status !== 'restoring') return;

    const area = type === 'custom-area' && reportId ? loadPrintReportArea(reportId) : null;

    if (area) {
      // Always restored as an upload: the map renders `uploadedGeojson` as a static polygon,
      // whereas a drawn `customGeojson` needs the drawing tool enabled to show up.
      setUploadTool({ enabled: false, uploadedGeojson: area.geojson, customGeojson: null });
      setAnalysis({ enabled: true });
      // Same object reference as `uploadedGeojson`, which `customAreaLabelAtom` checks.
      setCustomAreaName(area.name ? { name: area.name, geojson: area.geojson } : null);
    }

    setStatus('loading');
  }, [status, type, reportId, setUploadTool, setAnalysis, setCustomAreaName, setStatus]);
};

/** Moves `loading` → `capturing` once no query has been in flight for `SETTLE_MS`. */
export const useWaitForWidgetsSettled = () => {
  const [status, setStatus] = useAtom(printReportStatusAtom);
  const fetchingCount = useIsFetching();

  useEffect(() => {
    if (status !== 'loading' || fetchingCount > 0) return;
    const timer = window.setTimeout(() => setStatus('capturing'), SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [status, fetchingCount, setStatus]);
};
