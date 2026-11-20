'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { drawingToolAtom, drawingUploadToolAtom } from '@/store/drawing-tool';
import { printReportStatusAtom } from '@/store/print-report';
import { useSyncActiveWidgets } from '@/store/widgets';

import { toPng } from 'html-to-image';
import { useAtom, useAtomValue } from 'jotai';

import { WIDGETS } from '@/containers/datasets';
import { widgets, ANALYSIS_WIDGETS_SLUGS } from '@/containers/widgets/constants';
import { useWidgets } from '@/containers/widgets/hooks';

import type { WidgetTypes } from 'types/widget';

import { useRestorePrintReportArea, useWaitForWidgetsSettled } from './hooks';

const CARD_STYLE =
  'mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm print:max-h-[calc(100vh-20mm)]';

const PrintReportPage = () => {
  useRestorePrintReportArea();
  useWaitForWidgetsSettled();

  const [status, setStatus] = useAtom(printReportStatusAtom);
  const { customGeojson } = useAtomValue(drawingToolAtom);
  const { uploadedGeojson } = useAtomValue(drawingUploadToolAtom);
  const [activeWidgets] = useSyncActiveWidgets();
  const enabledWidgets = useWidgets();

  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const [snapshots, setSnapshots] = useState<Record<string, string>>({});

  const widgetsAvailable = useMemo(() => {
    if (customGeojson || uploadedGeojson) {
      return widgets.filter(({ slug }) => ANALYSIS_WIDGETS_SLUGS.includes(slug));
    }
    return enabledWidgets.filter(
      ({ slug }) => activeWidgets?.includes(slug) && slug !== 'widgets_deck_tool'
    );
  }, [activeWidgets, enabledWidgets, customGeojson, uploadedGeojson]) satisfies WidgetTypes[];

  const setCardRef = useCallback(
    (slug: string) => (node: HTMLDivElement | null) => {
      if (node) cardRefs.current.set(slug, node);
      else cardRefs.current.delete(slug);
    },
    []
  );

  // Freeze each loaded widget into an image so the printout matches the screen exactly
  // (no reflow, no half-finished animations). A card that fails to capture stays live.
  useEffect(() => {
    if (status !== 'capturing') return;
    let cancelled = false;

    const capture = async () => {
      const entries = await Promise.all(
        [...cardRefs.current.entries()].map(async ([slug, node]) => {
          try {
            return [slug, await toPng(node, { pixelRatio: 2, cacheBust: true })] as const;
          } catch (error) {
            console.error(`Print report: snapshot failed for ${slug}`, error);
            return null;
          }
        })
      );
      if (cancelled) return;
      setSnapshots(Object.fromEntries(entries.filter((e) => e !== null)));
      setStatus('ready');
    };

    void capture();
    return () => {
      cancelled = true;
    };
  }, [status, setStatus]);

  return (
    <div className="columns-2 gap-4 p-4 pt-6">
      {widgetsAvailable.map(({ slug, name }) => {
        const Widget = WIDGETS[slug];
        if (!Widget) return null;

        if (snapshots[slug]) {
          return (
            // eslint-disable-next-line @next/next/no-img-element -- in-memory data URL
            <img
              key={slug}
              src={snapshots[slug]}
              alt={`${name} widget`}
              className="mb-4 block h-auto w-full break-inside-avoid print:max-h-[calc(100vh-20mm)] print:object-contain"
            />
          );
        }

        return (
          <div key={slug} ref={setCardRef(slug)} className={CARD_STYLE}>
            <h2 className="mb-3 text-xs font-semibold tracking-wider text-black/60 uppercase">
              {name}
            </h2>
            <Widget />
          </div>
        );
      })}
    </div>
  );
};

export default PrintReportPage;
