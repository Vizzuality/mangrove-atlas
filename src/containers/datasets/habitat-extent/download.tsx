import Download from 'components/download-links';

const INFO = [
  {
    id: 1,
    title: 'Zenodo (vector and raster data)',
    href: 'https://zenodo.org/record/6894273',
  },
  {
    id: 2,
    title: 'JAXA (raster data)',
    href: 'https://www.eorc.jaxa.jp/ALOS/en/dataset/gmw_e.htm',
  },
  {
    id: 3,
    title: 'High-resolution 2020 extent: Zenodo',
    href: 'https://zenodo.org/records/12756047',
  },
];

const HabitatExtentDownload = () => <Download info={INFO} />;

export default HabitatExtentDownload;
