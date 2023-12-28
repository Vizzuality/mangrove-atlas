import { useMemo } from 'react';

import { useRouter } from 'next/router';

import { analysisAtom } from 'store/analysis';
import { drawingToolAtom, drawingUploadToolAtom } from 'store/drawing-tool';
import { mapSettingsAtom } from 'store/map-settings';
import { activeCategoryAtom } from 'store/sidebar';
import { activeWidgetsAtom } from 'store/widgets';

import { useRecoilValue } from 'recoil';

import type { WidgetTypes } from 'types/widget';

import widgets, { ANALYSIS_WIDGETS_SLUGS, MAP_SETTINGS_SLUGS } from './constants';
export function useWidgets(): WidgetTypes[] {
  const categorySelected = useRecoilValue(activeCategoryAtom);
  const { showWidget: isDrawingWidgetVisible } = useRecoilValue(drawingToolAtom);
  const { showWidget: isDrawinUploadWidgetVisible } = useRecoilValue(drawingUploadToolAtom);
  const isMapSettingsVisible = useRecoilValue(mapSettingsAtom);
  const { enabled: isAnalysisRunning } = useRecoilValue(analysisAtom);
  const {
    query: { params },
  } = useRouter();
  const locationType = params?.[0];
  const currentLocation = locationType || 'worldwide';
  const activeWidgets = useRecoilValue(activeWidgetsAtom);

  return useMemo(() => {
    if (isAnalysisRunning) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }

    if (isDrawingWidgetVisible) {
      return widgets.filter(({ slug }) => slug === 'mangrove_drawing_tool');
    }

    if (isDrawinUploadWidgetVisible) {
      return widgets.filter(({ slug }) => slug === 'mangrove_drawing_upload_tool');
    }

    if (isMapSettingsVisible) {
      return widgets.filter(({ slug }) => MAP_SETTINGS_SLUGS.includes(slug));
    }

    return widgets.filter(
      ({ slug, categoryIds, locationType }) =>
        (categoryIds?.includes(categorySelected) && locationType.includes(currentLocation)) ||
        (categoryIds?.includes('contextual_layers') && activeWidgets.includes(slug))
    );
  }, [
    categorySelected,
    currentLocation,
    isDrawingWidgetVisible,
    isDrawinUploadWidgetVisible,
    isAnalysisRunning,
    isMapSettingsVisible,
    activeWidgets,
  ]);
}
