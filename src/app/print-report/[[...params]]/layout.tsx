import Image from 'next/image';

import MapContainer from '@/containers/map';
import { LEAD_MAP_LAYER_IDS } from '@/containers/print-report/constants';
import PrintFooter from '@/containers/print-report/print-footer';
import PrintHeader from '@/containers/print-report/print-header';
import PrintMapCamera from '@/containers/print-report/print-map-camera';

export default function PrintReportLayout({ children }: { children: React.ReactNode }) {
  return (
    // id="main-content" is the target of the root layout's skip link.
    <main id="main-content" className="print-report relative min-h-screen w-full bg-white p-4">
      {/* The mark on transparent ground, in brand-800 — the app's `logo-bg.png`
          carries a teal wedge behind it, which reads as a printed block of ink
          in the corner of every page. Its top lines up with the title beside
          it. */}
      <Image
        src="/images/logo-mark.webp"
        alt="Global Mangrove Watch"
        width={48}
        height={57}
        // Served as authored: the optimizer would re-encode a 2KB mark for no
        // gain, and its cache keeps handing back the previous artwork.
        unoptimized
        className="absolute top-4 right-4 z-10 print:top-2"
      />
      {/* The page is laid out in millimetres on screen as well as in print:
          the A4 landscape box is 277x190mm after margins, and any size that
          changes between the two would re-frame the map — mapbox keeps the
          centre and zoom on resize, not the bounds, so the printed map would
          cover a different area than the one on screen. */}
      <div className="mx-auto w-full max-w-[277mm]">
        <PrintHeader />
        {/* The map and the habitat extent widget beneath it are the whole first
            page, which runs to 180mm — the narrower top margin of `@page :first`
            buys the map 10mm the following pages don't have. The map shows the
            mangrove extent alone; every other layer gets its own small map,
            beside the widget it belongs to, from page two on. */}
        <div className="print-report-map relative h-[105mm] w-full overflow-hidden rounded-[20px] border border-black/10">
          <MapContainer mapId="print-report" hideControls layerIds={LEAD_MAP_LAYER_IDS} />
          <PrintMapCamera />
        </div>
        {children}
        <PrintFooter />
      </div>
    </main>
  );
}
