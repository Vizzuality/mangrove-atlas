import { useCallback } from 'react';

import cn from 'lib/classnames';

import { drawingToolAtom } from 'store/drawing-tool';
import { mapSettingsAtom } from 'store/map-settings';
import { placeSectionAtom } from 'store/sidebar';

import { useRecoilState, useResetRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import BlogContent from 'containers/blog/content';

import { Dialog, DialogContent, DialogTrigger } from 'components/dialog';
import Icon from 'components/icon';

import CLOSE_SVG from 'svgs/ui/close.svg?sprite';
import NEWS_SVG from 'svgs/ui/news.svg?sprite';

import { STYLES } from '../constants';

const News = () => {
  const drawingToolState = useRecoilValue(drawingToolAtom);
  const [mapSettings, setMapViewState] = useRecoilState(mapSettingsAtom);
  const savePlaceSection = useSetRecoilState(placeSectionAtom);

  const { showWidget: isDrawingToolWidgetVisible } = drawingToolState;

  const resetDrawingToolState = useResetRecoilState(drawingToolAtom);
  const handleMapSettingsView = useCallback(async () => {
    setMapViewState(true);
    resetDrawingToolState();
    savePlaceSection(null);
  }, [resetDrawingToolState, savePlaceSection, setMapViewState]);

  return (
    <div className="relative">
      <div className="w-full max-w-[45px] pb-1 text-center font-sans text-xxs text-white md:block">
        News
      </div>
      <div className={`${STYLES['icon-wrapper']}`}>
        <Dialog>
          <DialogTrigger asChild>
            <div
              data-testid="menu-button"
              className="flex justify-center rounded-full p-2 md:bg-white"
            >
              <Icon icon={NEWS_SVG} className="h-7 w-7 text-brand-800" description="New" />
            </div>
          </DialogTrigger>

          <DialogContent className="scroll-y top-[5%] h-[96%] w-11/12 rounded-3xl px-0 pt-10 pb-0 font-sans md:top-auto md:h-[90vh] md:max-w-xl md:py-0">
            <BlogContent />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default News;
