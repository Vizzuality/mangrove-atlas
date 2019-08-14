import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { jsonToCSV } from 'utils/jsonParsers';
import { CSVLink } from 'react-csv';
import styles from './style.module.scss';


class DownloadLink extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})),
    slug: PropTypes.string
  }

  static defaultProps = {
    data: null,
    slug: null
  }

  render() {
    const { data, slug } = this.props;
    const csvData = jsonToCSV(data);
    return (
      <CSVLink
        className={styles.downloadButton}
        data={csvData}
        filename={`${slug}-${Date.now()}}.csv`}
      >
        Download raw data
      </CSVLink>
    );
  }
}

export default DownloadLink;
