import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom } from 'store/drawing-tool';
import { activeCategoryAtom } from 'store/sidebar';

import { useRecoilValue } from 'recoil';

import type { WidgetTypes } from 'types/widget';

import widgets, { ANALYSIS_WIDGETS_SLUGS } from './constants';

export function useWidgets(): WidgetTypes[] {
  const categorySelected = useRecoilValue(activeCategoryAtom);
  const { showWidget: isDrawingWidgetVisible } = useRecoilValue(drawingToolAtom);
  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const currentLocation = locationType || 'worldwide';

  return useMemo(() => {
    if (isAnalysisRunning) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }

    if (isDrawingWidgetVisible) {
      return widgets.filter(({ slug }) => slug === 'mangrove_drawing_tool');
    }

    return widgets.filter(
      ({ categoryIds, locationType }) =>
        categoryIds.includes(categorySelected) && locationType.includes(currentLocation)
    );
  }, [categorySelected, currentLocation, isDrawingWidgetVisible, isAnalysisRunning]);
}
