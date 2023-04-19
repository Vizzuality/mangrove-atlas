/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import AREA_SVG from 'svgs/sidebar/area.svg?sprite';
import CHART_SVG from 'svgs/sidebar/chart.svg?sprite';
import GLASS_SVG from 'svgs/sidebar/glass.svg?sprite';
import GLOBE_SVG from 'svgs/sidebar/globe.svg?sprite';
import RELOAD_SVG from 'svgs/sidebar/reload.svg?sprite';
import STAR_SVG from 'svgs/sidebar/star.svg?sprite';
import SUN_SVG from 'svgs/sidebar/sun.svg?sprite';

export const EXT_MENU_OPTIONS = [
  {
    id: 'about',
    label: 'About',
    href: 'https://www.mangrovealliance.org/about-us',
  },
  {
    id: 'mangroves',
    label: 'Mangroves',
    href: 'https://www.mangrovealliance.org/mangrove-forests',
  },
  {
    id: 'initiatives',
    label: 'Initiatives',
    href: 'https://www.mangrovealliance.org/initiatives',
  },
  {
    id: 'news',
    label: 'News',
    href: 'https://www.mangrovealliance.org/news',
  },
  {
    id: 'resources',
    label: 'Resources',
    href: 'https://www.mangrovealliance.org/tools-and-resources',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: 'https://www.mangrovealliance.org/contact',
  },
];

export const CATEGORY_OPTIONS = [
  { id: 'summary', label: 'Summary', icon: STAR_SVG },
  {
    id: 'restoration_and_conservation',
    label: 'Restoration & Conservation',
    icon: RELOAD_SVG,
  },
  { id: 'climate_and_policy', label: 'Climate & Policy', icon: SUN_SVG },
  { id: 'ecosystem_services', label: 'Ecosystem Services', icon: CHART_SVG },
];

export const PLACE_OPTIONS = [
  { id: 'globe', label: 'Globe', icon: GLOBE_SVG },
  {
    id: 'locations',
    label: 'Locations',
    icon: GLASS_SVG,
  },
  { id: 'area', label: 'Area', icon: AREA_SVG },
];
