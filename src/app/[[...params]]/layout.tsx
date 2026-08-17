import MapContainer from '@/containers/map';

import Providers from './providers';

export default function ParamsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {/*
        The map is this app's main content, so the main landmark belongs here,
        around the map and the widgets that annotate it. It previously wrapped
        only the widgets column, which left the skip link jumping *past* the map
        into the widget list. id="main-content" is the root layout's skip target.
      */}
      <main id="main-content" className="relative h-screen w-screen overflow-hidden">
        <MapContainer mapId="default" />
        {children}
      </main>
    </Providers>
  );
}
