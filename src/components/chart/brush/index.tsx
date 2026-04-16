'use client';

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { scaleLinear, type ScaleLinear } from 'd3-scale';

import type { Point, Box, Margin, BrushProps } from '@/components/chart/types';

import SVGBrush from './component';

const DEFAULT_MARGIN: Margin = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const FALLBACK_WIDTH = 454;
const FALLBACK_HEIGHT = 72;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function useElementSize<T extends HTMLElement | SVGElement>(ref: React.RefObject<T>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      });
    };

    update();

    const observer = new ResizeObserver(() => {
      update();
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}

function BrushComponent<T>({
  width,
  height,
  startIndex = 0,
  endIndex,
  margin: marginProp,
  data,
  minimumGap = 0,
  maximumGap = 0,
  onBrushEnd,
}: BrushProps<T>) {
  const margin: Margin = { ...DEFAULT_MARGIN, ...marginProp };

  const svgRef = useRef<SVGSVGElement | null>(null);
  const { width: measuredWidth, height: measuredHeight } = useElementSize(svgRef);

  const svgWidth = measuredWidth || (isFiniteNumber(width) ? width : FALLBACK_WIDTH);
  const svgHeight = measuredHeight || (isFiniteNumber(height) ? height : FALLBACK_HEIGHT);

  const resolvedEndIndex = endIndex ?? Math.max(data.length - 1, 0);

  const scale: ScaleLinear<number, number> = useMemo(() => {
    return scaleLinear()
      .domain([0, Math.max(data.length - 1, 0)])
      .rangeRound([margin.left, svgWidth - margin.right]);
  }, [data.length, margin.left, margin.right, svgWidth]);

  const [brushSelection, setBrushSelection] = useState<Box | null>(null);

  const shadowFilterId = useId().replace(/:/g, '');

  const ready = useMemo(() => {
    return !!(svgWidth && svgHeight && data.length > 1);
  }, [svgWidth, svgHeight, data.length]);

  const selectionRef = useRef<Box | null>(null);

  useEffect(() => {
    if (!ready) return;

    selectionRef.current = [
      [scale(startIndex), margin.top],
      [scale(resolvedEndIndex), svgHeight - margin.bottom],
    ];

    setBrushSelection(selectionRef.current);
  }, [ready, scale, startIndex, resolvedEndIndex, margin.top, margin.bottom, svgHeight]);

  const getEventMouse = useCallback((event: React.PointerEvent<SVGElement>): Point => {
    const svg = svgRef.current;
    if (!svg) return [0, 0];

    const rect = svg.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }, []);

  const renderBackground = ready && (
    <rect
      x={margin.left}
      y={margin.top}
      width={Math.max(svgWidth - margin.left - margin.right, 0)}
      height={Math.max(svgHeight - margin.bottom - margin.top, 0)}
      fill="#FFF"
      fillOpacity="0"
      pointerEvents="none"
    />
  );

  return (
    <div className="c-brush">
      <svg ref={svgRef} className="brush--svg" width={width} height={height}>
        <defs>
          <filter id={shadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              stdDeviation="2"
              in="blur"
              dx="0"
              dy="0"
              floodColor="#1F3646"
              floodOpacity="0.5"
              width="100%"
              height="100%"
              result="dropShadow"
            />
          </filter>
        </defs>

        {renderBackground}

        {ready && brushSelection && (
          <SVGBrush
            scale={scale}
            minimumGap={minimumGap}
            maximumGap={maximumGap}
            extent={[
              [margin.left, margin.top],
              [svgWidth - margin.right, svgHeight - margin.bottom],
            ]}
            getEventMouse={getEventMouse}
            brushType="x"
            selection={brushSelection}
            shadowFilterId={shadowFilterId}
            onBrush={({ selection }) => {
              setBrushSelection(selection);
            }}
            onBrushEnd={({ selection }) => {
              if (!selection) {
                setBrushSelection(null);
                return;
              }

              const [[sx0, sy0], [sx1, sy1]] = selection;
              const rx0 = Math.round(scale.invert(sx0));
              const rx1 = Math.round(scale.invert(sx1));

              setBrushSelection([
                [sx0, sy0],
                [sx1, sy1],
              ]);

              onBrushEnd?.({
                startIndex: rx0,
                endIndex: rx1,
              });
            }}
          />
        )}
      </svg>
    </div>
  );
}

const Brush = memo(BrushComponent) as typeof BrushComponent;
export default Brush;
