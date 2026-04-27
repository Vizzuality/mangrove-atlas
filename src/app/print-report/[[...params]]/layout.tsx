import Image from 'next/image';

import MapContainer from '@/containers/map';
import PrintHeader from '@/containers/print-report/print-header';
import PrintLegend from '@/containers/print-report/print-legend';

export default function PrintReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="print-report relative min-h-screen w-full bg-white p-4">
      <Image
        src="/images/logo-bg.png"
        alt="Global Mangrove Watch"
        width={80}
        height={93}
        className="absolute top-0 right-0 z-10"
      />
      <PrintHeader />
      <div className="print-report-map relative h-[60vh] w-full overflow-hidden rounded-3xl border border-gray-200">
        <MapContainer mapId="print-report" hideControls />
        <PrintLegend />
      </div>
      {children}
    </div>
  );
}
