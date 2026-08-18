import Image from 'next/image';

import MapContainer from '@/containers/map';
import PrintFooter from '@/containers/print-report/print-footer';
import PrintHeader from '@/containers/print-report/print-header';
import PrintLegend from '@/containers/print-report/print-legend';
import PrintMapCamera from '@/containers/print-report/print-map-camera';

export default function PrintReportLayout({ children }: { children: React.ReactNode }) {
  return (
    // id="main-content" is the target of the root layout's skip link.
    <main id="main-content" className="print-report relative min-h-screen w-full bg-white p-4">
      <Image
        src="/images/logo-bg.png"
        alt="Global Mangrove Watch"
        width={80}
        height={93}
        className="absolute top-0 right-0 z-10"
      />
      {/* The page is laid out in millimetres on screen as well as in print:
          the A4 portrait box is 190x277mm after margins, and any size that
          changes between the two would re-frame the map — mapbox keeps the
          centre and zoom on resize, not the bounds, so the printed map would
          cover a different area than the one on screen. */}
      <div className="mx-auto w-full max-w-[190mm]">
        <PrintHeader />
        <div className="print-report-map relative h-[110mm] w-full overflow-hidden rounded-3xl border border-gray-200">
          <MapContainer mapId="print-report" hideControls />
          <PrintMapCamera />
          <PrintLegend />
        </div>
        {children}
        <PrintFooter />
      </div>
    </main>
  );
}
