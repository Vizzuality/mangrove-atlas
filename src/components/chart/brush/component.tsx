'use client';

import { memo, useCallback, useRef, useState } from 'react';

import { SVGBrushProps, Point, Box, SVGBrushEvent } from '@/components/chart/types';

const defaultGetEventMouse = (event: React.PointerEvent<SVGElement>): Point => [
  event.clientX,
  event.clientY,
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function shiftX(x0: number, x1: number, dx: number, ex0: number, ex1: number): [number, number] {
  if (x0 + dx < ex0) return [ex0, x1 + (ex0 - x0)];
  if (x1 + dx > ex1) return [x0 + (ex1 - x1), ex1];
  return [x0 + dx, x1 + dx];
}

function shiftY(y0: number, y1: number, dy: number, ey0: number, ey1: number): [number, number] {
  if (y0 + dy < ey0) return [ey0, y1 + (ey0 - y0)];
  if (y1 + dy > ey1) return [y0 + (ey1 - y1), ey1];
  return [y0 + dy, y1 + dy];
}

function SVGBrushComponent({
  selection: controlledSelection,
  extent,
  minimumGap = 0,
  maximumGap = 0,
  onBrushStart = () => {},
  onBrush = () => {},
  onBrushEnd = () => {},
  getEventMouse = defaultGetEventMouse,
  brushType = '2d',
  scale,
  shadowFilterId,
}: SVGBrushProps) {
  const [internalSelection, setInternalSelection] = useState<Box | null>(
    controlledSelection ?? null
  );
  const moveRef = useRef<Point | null>(null);
  const handleERef = useRef<SVGRectElement | null>(null);
  const handleWRef = useRef<SVGRectElement | null>(null);

  const selection = controlledSelection === undefined ? internalSelection : controlledSelection;

  const [[ex0, ey0], [ex1, ey1]] = extent;

  const emit = useCallback(
    (
      type: 'start' | 'brush' | 'end',
      nextSelection: Box | null,
      sourceEvent: React.PointerEvent<SVGElement>
    ) => {
      const payload: SVGBrushEvent = {
        target: null,
        type,
        selection: nextSelection,
        sourceEvent,
      };

      if (type === 'start') onBrushStart(payload);
      if (type === 'brush') onBrush(payload);
      if (type === 'end') onBrushEnd(payload);
    },
    [onBrushStart, onBrush, onBrushEnd]
  );

  const handleBrushStart = useCallback(
    (event: React.PointerEvent<SVGElement>) => {
      if ('setPointerCapture' in event.currentTarget) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      moveRef.current = getEventMouse(event);
      emit('start', selection ?? null, event);
    },
    [emit, getEventMouse, selection]
  );

  const handleBrushEnd = useCallback(
    (event: React.PointerEvent<SVGElement>) => {
      moveRef.current = null;
      emit('end', selection ?? null, event);
    },
    [emit, selection]
  );

  const updateSelection = useCallback(
    (nextSelection: Box, event: React.PointerEvent<SVGElement>) => {
      if (controlledSelection === undefined) {
        setInternalSelection(nextSelection);
      }
      emit('brush', nextSelection, event);
    },
    [controlledSelection, emit]
  );

  if (!selection) {
    return (
      <g className="brush">
        <rect
          className="overlay"
          pointerEvents="none"
          fill="none"
          x={ex0}
          y={ey0}
          width={ex1 - ex0}
          height={ey1 - ey0}
        />
      </g>
    );
  }

  const [[x0, y0], [x1, y1]] = selection;
  const x = x0;
  const y = y0;
  const w = Math.max(0, Number.isFinite(x1 - x0) ? x1 - x0 : 0);
  const h = Number.isFinite(y1 - y0) ? y1 - y0 : 0;

  const hW = 1;
  const hH = Math.max(0, h - 10);

  return (
    <g className="brush">
      <rect
        className="overlay"
        pointerEvents="none"
        fill="none"
        x={ex0}
        y={ey0}
        width={ex1 - ex0}
        height={ey1 - ey0}
      />

      <rect
        fill="url(#diagonal-stripe-1)"
        fillOpacity="0.75"
        shapeRendering="crispEdges"
        x={ex0}
        y={ey0}
        width={Math.max(0, Number.isFinite(x0 - ex0) ? x0 - ex0 : 0)}
        height={Math.max(0, h - 2)}
        pointerEvents="all"
      />

      <rect
        fill="url(#diagonal-stripe-1)"
        fillOpacity="0.75"
        shapeRendering="crispEdges"
        x={x1}
        y={ey0}
        width={Math.max(0, Number.isFinite(ex1 - x1) ? ex1 - x1 : 0)}
        height={Math.max(0, h - 2)}
        pointerEvents="all"
      />

      <rect
        className="selection"
        cursor="move"
        fill="#777"
        fillOpacity="0"
        shapeRendering="crispEdges"
        x={x}
        y={y + 1}
        width={w}
        height={Math.max(0, h - 2)}
        onPointerDown={handleBrushStart}
        onPointerMove={(event) => {
          const move = moveRef.current;
          if (!move) return;

          const [mx, my] = getEventMouse(event as React.PointerEvent<SVGElement>);
          const [sx, sy] = move;
          const dx = mx - sx;
          const dy = my - sy;

          const [nx0, nx1] = shiftX(x0, x1, dx, ex0, ex1);
          const [ny0, ny1] = shiftY(y0, y1, dy, ey0, ey1);

          let nextSelection: Box = selection;

          switch (brushType) {
            case '2d':
              nextSelection = [
                [nx0, ny0],
                [nx1, ny1],
              ];
              break;
            case 'x':
              nextSelection = [
                [nx0, y0],
                [nx1, y1],
              ];
              break;
            case 'y':
              nextSelection = [
                [x0, ny0],
                [x1, ny1],
              ];
              break;
          }

          moveRef.current = [mx, my];
          updateSelection(nextSelection, event as React.PointerEvent<SVGElement>);
        }}
        onPointerUp={handleBrushEnd}
      />

      <g transform={`translate(${x + w - hW / 2}, ${y + 5})`}>
        <rect
          ref={handleERef}
          className="handle handle--e"
          cursor="ew-resize"
          width={hW}
          height={hH}
          fill="rgba(0, 0, 0, 0.85)"
          stroke="rgba(0, 0, 0, 0.85)"
          filter={`url(#${shadowFilterId})`}
          pointerEvents="visible"
          onPointerDown={handleBrushStart}
          onPointerMove={(event) => {
            const move = moveRef.current;
            if (!move) return;

            const [mx, my] = getEventMouse(event);
            const [sx] = move;
            const dx = mx - sx;

            const rawX = clamp(x1 + dx, ex0, ex1);
            const [nextX0Base, nextX1Base] = x0 < rawX ? [x0, rawX] : [x0, x0];

            const scaleX0 = scale.invert(nextX0Base);
            const scaleX1 = scale.invert(nextX1Base);
            const scaleEX0 = scale.invert(ex0);

            let nextX0 = nextX0Base;
            let nextX1 = nextX1Base;

            if (minimumGap && scaleX1 - scaleX0 <= minimumGap) {
              if (scaleX0 <= scaleEX0) {
                nextX0 = ex0;
                nextX1 = scale(scaleX0 + minimumGap);
              } else {
                nextX0 = scale(scaleX1 - minimumGap);
              }
            }

            if (maximumGap && scaleX1 - scaleX0 > maximumGap) {
              nextX0 = scale(scaleX1 - maximumGap);
            }

            let nextSelection: Box = selection;
            switch (brushType) {
              case '2d':
              case 'x':
                nextSelection = [
                  [nextX0, y0],
                  [nextX1, y1],
                ];
                break;
            }

            moveRef.current = [mx, my];
            updateSelection(nextSelection, event);

            if (x0 >= rawX && handleWRef.current) {
              handleWRef.current.setPointerCapture(event.pointerId);
            }
          }}
          onPointerUp={handleBrushEnd}
        />
        <polygon
          points="0.5,-5 0.5,5 6,-5"
          style={{
            fill: 'rgba(0,0,0,0.85)',
            stroke: 'rgba(0,0,0,0.85)',
            strokeWidth: 1,
          }}
        />
      </g>

      <g transform={`translate(${x - hW / 2}, ${y + 5})`}>
        <rect
          ref={handleWRef}
          className="handle handle--w"
          cursor="ew-resize"
          width={hW}
          height={hH}
          fill="rgba(0, 0, 0, 0.85)"
          stroke="rgba(0, 0, 0, 0.85)"
          filter={`url(#${shadowFilterId})`}
          pointerEvents="visible"
          onPointerDown={handleBrushStart}
          onPointerMove={(event) => {
            const move = moveRef.current;
            if (!move) return;

            const [mx, my] = getEventMouse(event);
            const [sx] = move;
            const dx = mx - sx;

            const rawX = clamp(x0 + dx, ex0, ex1);
            const [nextX0Base, nextX1Base] = rawX < x1 ? [rawX, x1] : [x1, x1];

            const scaleX0 = scale.invert(nextX0Base);
            const scaleX1 = scale.invert(nextX1Base);
            const scaleEX1 = scale.invert(ex1);

            let nextX0 = nextX0Base;
            let nextX1 = nextX1Base;

            if (minimumGap && scaleX1 - scaleX0 <= minimumGap) {
              if (scaleX1 >= scaleEX1) {
                nextX0 = scale(scaleEX1 - minimumGap);
                nextX1 = ex1;
              } else {
                nextX1 = scale(scaleX0 + minimumGap);
              }
            }

            if (maximumGap && scaleX1 - scaleX0 > maximumGap) {
              nextX1 = scale(scaleX0 + maximumGap);
            }

            let nextSelection: Box = selection;
            switch (brushType) {
              case '2d':
              case 'x':
                nextSelection = [
                  [nextX0, y0],
                  [nextX1, y1],
                ];
                break;
            }

            moveRef.current = [mx, my];
            updateSelection(nextSelection, event);

            if (rawX >= x1 && handleERef.current) {
              handleERef.current.setPointerCapture(event.pointerId);
            }
          }}
          onPointerUp={handleBrushEnd}
        />
        <polygon
          points="-5,-5 0.5,5 0.5,-5"
          style={{
            fill: 'rgba(0,0,0,0.85)',
            stroke: 'rgba(0,0,0,0.85)',
            strokeWidth: 1,
          }}
        />
      </g>
    </g>
  );
}

const SVGBrush = memo(SVGBrushComponent);
export default SVGBrush;
