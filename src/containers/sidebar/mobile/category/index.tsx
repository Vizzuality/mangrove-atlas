import React from 'react';

import cn from 'lib/classnames';

import { mapSettingsAtom } from 'store/map-settings';
import { activeCategoryAtom, useSetActiveCategory } from 'store/sidebar';

import { VscLayers } from 'react-icons/vsc';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import CHART_SVG from 'svgs/sidebar/chart.svg?sprite';

const CategoryMobile = () => {
  const category = useRecoilValue(activeCategoryAtom);
  const setCategory = useSetActiveCategory();
  const [mapSettings, setMapSettings] = useRecoilState(mapSettingsAtom);

  const handleClick = async (id) => {
    if (mapSettings) setMapSettings(false);
    await setCategory(id);
  };

  return (
    <div className="relative">
      <div className="-mt-0.5 w-full font-sans text-xxs text-white">Categories</div>
    </div>
  );
};

export default CategoryMobile;
