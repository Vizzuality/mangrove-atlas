import ALL_SVG from 'svgs/sidebar/all.svg?sprite';
import CHART_SVG from 'svgs/sidebar/chart.svg?sprite';
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

const CATEGORY_OPTIONS = [
  { id: 'distribution_and_change', label: 'Distribution & Change', icon: STAR_SVG },
  {
    id: 'restoration_and_conservation',
    label: 'Restoration & Conservation',
    icon: RELOAD_SVG,
  },
  { id: 'climate_and_policy', label: 'Climate & Policy', icon: SUN_SVG },
  { id: 'ecosystem_services', label: 'Ecosystem Services', icon: CHART_SVG },
  { id: 'contextual_layers', label: 'Contextual layers', icon: SUN_SVG },
  { id: 'all_datasets', label: 'All datasets', icon: ALL_SVG },
];

export const STYLES = {
  'icon-wrapper': 'flex h-10.5 w-10.5 flex-col items-center justify-center text-brand-800',
};

export default CATEGORY_OPTIONS;
