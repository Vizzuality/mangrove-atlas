import { shouldShowTickLabel, MAX_TICK_LABELS } from '@/components/chart/chart-tick';

describe('shouldShowTickLabel', () => {
  it('shows every label when the tick count fits within maxLabels', () => {
    const count = 5;
    const shown = Array.from({ length: count }, (_, i) => shouldShowTickLabel(i, count, 8));
    expect(shown.every(Boolean)).toBe(true);
  });

  it('thins labels evenly when there are more ticks than maxLabels', () => {
    const count = 16;
    // step = ceil(16 / 8) = 2 -> labels on even indices
    const shownIndices = Array.from({ length: count }, (_, i) => i).filter((i) =>
      shouldShowTickLabel(i, count, 8)
    );
    expect(shownIndices).toContain(0);
    expect(shownIndices).toContain(2);
    expect(shownIndices).not.toContain(1);
    expect(shownIndices).not.toContain(3);
  });

  it('always shows the first and last tick', () => {
    const count = 30;
    expect(shouldShowTickLabel(0, count, 8)).toBe(true);
    expect(shouldShowTickLabel(count - 1, count, 8)).toBe(true);
  });

  it('defaults maxLabels to MAX_TICK_LABELS', () => {
    const count = MAX_TICK_LABELS * 3;
    const withDefault = shouldShowTickLabel(MAX_TICK_LABELS, count);
    const withExplicit = shouldShowTickLabel(MAX_TICK_LABELS, count, MAX_TICK_LABELS);
    expect(withDefault).toBe(withExplicit);
  });
});
