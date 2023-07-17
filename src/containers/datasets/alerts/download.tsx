import Download from 'components/download-links';

const INFO = [
  {
    id: 17,
    title: 'Mangrove Alerts',
    href: 'https://storage.googleapis.com/mangrove_atlas/deforestation-alerts/Downloads/gmw_alerts_latest.gpkg',
    description: false,
  },
];
const AlertsDownload = () => <Download info={INFO} />;

export default AlertsDownload;
