import type { FC } from 'react';

// Max year/date labels drawn on an axis before we thin them so they never crowd.
export const MAX_TICK_LABELS = 8;

// Whether a tick at `index` should render its label: evenly spaced positions plus
// the last tick, so a dense axis shows a readable, non-overlapping subset.
export function shouldShowTickLabel(
  index: number,
  visibleTicksCount: number,
  maxLabels: number = MAX_TICK_LABELS
): boolean {
  const step = Math.max(1, Math.ceil(visibleTicksCount / maxLabels));
  return index % step === 0 || index === visibleTicksCount - 1;
}

export type ChartTickProps = {
  // Injected by recharts.
  x?: number;
  y?: number;
  payload?: { value: string | number };
  index?: number;
  visibleTicksCount?: number;
  // Per-widget customization (defaults match the design spec).
  offsetY?: number; // vertical gap between the tick mark and its label
  fontSize?: number;
  textAnchor?: 'start' | 'middle' | 'end';
  maxLabels?: number;
  angle?: number; // rotate the label (e.g. -90 for vertical month labels)
};

// Shared axis tick used across widget charts/brushes so tick↔label padding and
// typography stay consistent. Widgets tweak only fontSize / textAnchor / maxLabels.
const ChartTick: FC<ChartTickProps> = ({
  x = 0,
  y = 0,
  payload,
  index = 0,
  visibleTicksCount = 1,
  offsetY = 16,
  fontSize = 12,
  textAnchor = 'middle',
  maxLabels = MAX_TICK_LABELS,
  angle,
}) => {
  if (!shouldShowTickLabel(index, visibleTicksCount, maxLabels)) {
    return <g transform={`translate(${x},${y})`} />;
  }
  const rotated = typeof angle === 'number';
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={offsetY}
        // Rotate around the tick point so vertical labels hang straight below it.
        transform={rotated ? `rotate(${angle}, 0, ${offsetY})` : undefined}
        textAnchor={rotated ? 'end' : textAnchor}
        dominantBaseline={rotated ? 'central' : undefined}
        fill="rgba(0,0,0,0.56)"
        fontFamily="Open Sans"
        fontWeight={400}
        fontSize={`${fontSize}px`}
      >
        {payload?.value}
      </text>
    </g>
  );
};

export default ChartTick;
