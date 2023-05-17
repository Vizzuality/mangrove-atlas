import Download from 'components/download-links';

const INFO = [
  {
    id: 22,
    title: 'Mangrove Biomass',
    href: 'https://daac.ornl.gov/CMS/guides/CMS_Global_Map_Mangrove_Canopy.html',
    description: 'External link to download mangrove biomass data from source (NASA)',
  },
];
const BiomassDownload = () => <Download info={INFO} />;

export default BiomassDownload;
