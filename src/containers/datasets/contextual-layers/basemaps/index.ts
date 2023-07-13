export type BasemapId = 'light' | 'dark' | 'satellite';

type BasemapTypes = {
  id: BasemapId;
  type: 'basemap';
  name: string;
  url: string;
};

const BASEMAPS = [
  {
    id: 'light',
    type: 'basemap',
    name: 'Light',
    url: 'mapbox://styles/globalmangrovewatch/clgp5mmhi00id01r75mtg34ep',
  },
  {
    id: 'dark',
    type: 'basemap',
    name: 'Dark',
    url: 'mapbox://styles/globalmangrovewatch/clgosax9c00hb01mjasccdds6',
  },
  {
    id: 'satellite',
    type: 'basemap',
    name: 'Satellite',
    url: 'mapbox://styles/globalmangrovewatch/clk0y3gom00a201qj04psh0qv/draft',
  },
] satisfies BasemapTypes[];

export default BASEMAPS;
