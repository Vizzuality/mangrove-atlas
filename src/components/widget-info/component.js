import React from 'react';
import PropTypes from 'prop-types';
import DownloadLink from 'components/link';
import Button from 'components/button';
import styles from './style.module.scss';
import Info from './info.svg';
import ArrowRight from './arrow-right.svg';

const WidgetInfo = ({
  data: { chartData },
  data,
  downloadData,
  openInfoPanel,
  filename,
  current,
  locationsList
}) => {
  const selectedLocation = locationsList
    .filter(location => location.iso === current || location.id === current || location.iso === 'WORLDWIDE')
    .map(l => [
      [`location - ${l.name}  `],
      [`location_type - ${l.location_type}  `],
      [`location_id - ${l.location_id}  `],
      [`iso - ${l.iso}  `]
    ]);
  return (
    <div className={styles.info}>
      {filename !== 'highlighted_places' && (
        <DownloadLink
          data={downloadData || chartData || data}
          filename={filename}
          label={selectedLocation}
          headers={selectedLocation}
        />
      )}
      <Button
        onClick={() => openInfoPanel(filename)}
        isTransparent
        className={styles.button}
      >
        <img
          src={filename !== 'highlighted_places'
            ? Info
            : ArrowRight
          }
          className={styles.icon}
          alt="info-icon"
        />
        <span>
          {filename !== 'highlighted_places'
            ? 'More Info'
            : 'Explore more places'
          }
        </span>
      </Button>
    </div>
  );
};

WidgetInfo.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({})
  ]),
  downloadData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({})
  ]),
  filename: PropTypes.string,
  openInfoPanel: PropTypes.func,
  current: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  locationsList: PropTypes.array.isRequired

};

WidgetInfo.defaultProps = {
  data: null,
  downloadData: null,
  filename: null,
  openInfoPanel: () => null
};

export default WidgetInfo;
