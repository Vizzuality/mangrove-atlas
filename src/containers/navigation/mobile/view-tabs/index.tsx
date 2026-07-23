import { mapViewAtom } from '@/store/sidebar';

import { useAtom } from 'jotai';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import DASHBOARD_SVG from '@/svgs/ui/dashboard';
import MAP_VIEW_SVG from '@/svgs/ui/map-view';

const ViewTabs = () => {
  const [mapView, setMapView] = useAtom(mapViewAtom);

  return (
    <Tabs
      value={mapView ? 'map' : 'dashboard'}
      onValueChange={(value) => setMapView(value === 'map')}
    >
      <TabsList variant="pill" className="pointer-events-auto">
        <TabsTrigger variant="pill" value="dashboard">
          <DASHBOARD_SVG className="h-3 w-3" role="img" title="Dashboard" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger variant="pill" value="map">
          <MAP_VIEW_SVG className="h-3 w-3" role="img" title="Map" />
          Map
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ViewTabs;
