import Download from '@/components/download-links';

const INFO = [
  {
    id: 1,
    title: 'Zenodo (vector and raster data)',
    href: 'https://doi.org/10.5281/zenodo.21346456',
  },
  {
    id: 2,
    title: 'JAXA (raster data)',
    href: 'https://www.eorc.jaxa.jp/ALOS/en/dataset/gmw_e.htm',
  },
  {
    id: 3,
    title: '2020 high-resolution mangrove extent layer (10m): Zenodo',
    href: 'https://zenodo.org/records/12756047',
  },
];

const HabitatExtentDownload = () => <Download info={INFO} />;

export default HabitatExtentDownload;
