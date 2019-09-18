import React from 'react';
import PropTypes from 'prop-types';
import DownloadLink from 'components/link';
import Button from 'components/button';
import styles from './style.module.scss';
import Info from './info.svg';
import ArrowRight from './arrow-right.svg';

const WidgetInfo = ({ data: { chartData }, openInfoPanel, filename }) => (
  <div className={styles.info}>
    {filename !== 'highlighted_places' && (
      <DownloadLink
        data={chartData}
        filename={filename}
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

WidgetInfo.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({})
  ]),
  filename: PropTypes.string,
  openInfoPanel: PropTypes.func
}

WidgetInfo.defaultProps = {
  data: null,
  filename: null,
  openInfoPanel: () => null
}

export default WidgetInfo;
