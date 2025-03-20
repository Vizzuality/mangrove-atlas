import Download from 'components/download-links';

const INFO = [
  {
    id: 18,
    title: 'Mangrove Blue Carbon (Total)',
    href: 'https://console.cloud.google.com/storage/browser/mangrove_atlas/ee_export_tiffs/total_organic_carbon?pageState=(%22StorageObjectListTable%22:(%22f%22:%22%255B%255D%22))&prefix=&forceOnObjectsSortingFiltering=false',
  },
  {
    id: 19,
    title: 'Mangrove Soil Carbon',
    href: 'https://zenodo.org/record/2536803#.YP6xOuhKg2x',
    description: null,
    // license: 'Creative Commons Attribution Share Alike 4.0 International',
  },
  // {
  //   id: 20,
  //   title: 'Mangrove Aboveground Carbon',
  //   href: null,
  //   description: false
  // },
];
const BlueCarbonDownload = () => <Download info={INFO} />;

export default BlueCarbonDownload;

// TO - DO check why license is hidden
