/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import CHART_SVG from 'svgs/chart.svg?sprite';
import RELOAD_SVG from 'svgs/reload.svg?sprite';
import STAR_SVG from 'svgs/star.svg?sprite';
import SUN_SVG from 'svgs/sun.svg?sprite';

export const WIDGET_OPTIONS = [
  { id: 'summary', label: 'Summary', icon: STAR_SVG },
  {
    id: 'restoration_and_conservation',
    label: 'Restoration & Conservation',
    icon: RELOAD_SVG,
  },
  { id: 'climate_and_policy', label: 'Climate & Policy', icon: SUN_SVG },
  { id: 'ecosystem_services', label: 'Ecosystem Services', icon: CHART_SVG },
];
