'use client';

import { useMemo } from 'react';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { useSyncActiveWidgets } from '@/store/widgets';

import { useAtom } from 'jotai';

import { WIDGETS } from '@/containers/datasets';
import { widgets, ANALYSIS_WIDGETS_SLUGS } from '@/containers/widgets/constants';
import { useWidgets } from '@/containers/widgets/hooks';

import type { WidgetTypes } from 'types/widget';

const PrintReportPage = () => {
  const [{ customGeojson }] = useAtom(drawingToolAtom);
  const [{ uploadedGeojson }] = useAtom(drawingUploadToolAtom);
  const [activeWidgets] = useSyncActiveWidgets();
  const enabledWidgets = useWidgets();

  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    return enabledWidgets.filter(
      ({ slug }) => activeWidgets?.includes(slug) && slug !== 'widgets_deck_tool'
    );
  }, [activeWidgets, enabledWidgets, customGeojson, uploadedGeojson]) satisfies WidgetTypes[];

  return (
    <div className="columns-2 gap-4 p-4 pt-6">
      {widgetsAvailable.map(({ slug, name }) => {
        const Widget = WIDGETS[slug];
        if (!Widget) return null;
        return (
          <div
            key={slug}
            className="mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm print:max-h-[calc(100vh-20mm)]"
          >
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-black/60 uppercase">
              {name}
            </h3>
            <Widget />
          </div>
        );
      })}
    </div>
  );
};

export default PrintReportPage;
