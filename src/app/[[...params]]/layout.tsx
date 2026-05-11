import MapContainer from '@/containers/map';

import Providers from './providers';

export default function ParamsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="relative h-screen w-screen overflow-hidden">
        <MapContainer mapId="default" />
        {children}
      </div>
    </Providers>
  );
}
