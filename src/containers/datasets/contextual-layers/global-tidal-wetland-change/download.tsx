import Download from 'components/download-links';

const INFO = [
  {
    id: 1,
    title: 'Download',
    href: 'https://developers.google.com/earth-engine/datasets/catalog/JCU_Murray_GIC_global_tidal_wetland_change_2019',
  },
];
const GlobalTidalWetlandChangeDownload = () => <Download info={INFO} />;

export default GlobalTidalWetlandChangeDownload;
