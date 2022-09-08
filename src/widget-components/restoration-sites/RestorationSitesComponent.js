
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Widget from 'components/widget';

import restorationSiteStyles from './restorationSiteStyles.module.scss';


const RestorationSites = ({
  data,
  isLoading,
  isCollapsed = true,
  slug = undefined,
  name,
  ...props
}) => {
  const sitesCount = data.length;
  const isMoreThanOneSite = sitesCount > 1;

  return (
    <Widget
      name={name}
      slug={slug}
      isCollapsed={isCollapsed}
      isLoading={isLoading}
      {...props}
    >
      <p className={restorationSiteStyles.sentence}>
        There
        {isMoreThanOneSite ? ' are ' : ' is '}
        <>
          {sitesCount}
        </>
        {' '}
        restoration site
        {isMoreThanOneSite ? 's.' : '.'}
      </p>
    </Widget>
  );
};

RestorationSites.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  fetchRestorationSites: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool,
  isLoading: PropTypes.bool,
  name: PropTypes.string,
  slug: PropTypes.string,
};

RestorationSites.defaultProps = {
  isCollapsed: false,
  isLoading: false,
  name: null,
  slug: null,
};

export default RestorationSites;
