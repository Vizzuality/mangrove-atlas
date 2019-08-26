import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DownloadLink from 'components/link';
import Button from 'components/button';
import styles from './style.module.scss';
import Info from './info.svg';
import ArrowRight from './arrow-right.svg';

class WidgetInfo extends PureComponent {
  static propTypes = {
    openInfoPanel: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.shape({})),
    filename: PropTypes.string
  }

  static defaultProps = {
    data: null,
    filename: null,
    openInfoPanel: () => null
  }

  clickHandler = () => {
    const { openInfoPanel } = this.props;
    openInfoPanel();
  }

  render() {
    const { data, filename } = this.props;
    return (
      <div className={styles.info}>
        {filename && (
          <DownloadLink
            data={data}
            filename={filename}
          />
        )}
        <Button
          onClick={this.clickHandler}
          isTransparent
          className={styles.button}
        >
          <img
            src={filename
              ? Info
              : ArrowRight
            }
            className={styles.icon}
            alt="info-icon"
          />
          <span>
            {filename
              ? 'More Info'
              : 'Explore more places'
            }
          </span>
        </Button>


      </div>
    );
  }
}

export default WidgetInfo;
