import Download from 'components/download-links';

const INFO = [
  {
    id: 1,
    title: 'Scientific paper',
    href: 'https://dx.doi.org/10.1038/s41597-022-01635-5',
  },
  {
    id: 2,
    title: 'Download',
    href: 'https://www.intertidal.app/download',
  },
  {
    id: 3,
    title: 'Data usage guidance',
    href: 'https://www.intertidal.app/about',
  },
];
const TidalFlatsDownload = () => <Download info={INFO} />;

export default TidalFlatsDownload;
