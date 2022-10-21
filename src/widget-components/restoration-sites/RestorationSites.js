import ChartWidget from 'components/chart-widget';
import React, { useEffect } from 'react';
import Select from 'components/select';

import restorationSiteStyles from './restorationSiteStyles.module.scss';
import Widget from 'components/widget';

const RestorationSites = ({
  isLoading,
  isCollapsed = true,
  slug, name,
  ...props
}) => {
  useEffect(function loadRestorationSites() {}, []);
  return (
    <Widget
      name={name}
      slug={slug}
      isCollapsed={isCollapsed}
      {...props}
    >
      <p className={restorationSiteStyles.sentence}>There are X restoration sites</p>
    </Widget>
  );
};

export default RestorationSites;
