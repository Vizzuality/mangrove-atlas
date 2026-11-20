import { atom } from 'jotai';

/**
 * Lifecycle of the print report page:
 * - `restoring`: reading the custom area handed over by the opener tab
 * - `loading`: widgets are fetching data / settling (chart animations)
 * - `capturing`: turning each widget card into a static image
 * - `ready`: safe to print
 */
export type PrintReportStatus = 'restoring' | 'loading' | 'capturing' | 'ready';

export const printReportStatusAtom = atom<PrintReportStatus>('restoring');
