import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import cn from '@/lib/classnames';

import PauseIcon from '@/svgs/ui/pause';
import PlayIcon from '@/svgs/ui/play';

const APPROX_LABEL_WIDTH = 32;

type TimelineProps = {
  years: number[];
  currentYear: number;
  isPlaying: boolean;
  onYearChange: (year: number) => void;
  onTogglePlay: () => void;
};

const Timeline = ({ years, currentYear, isPlaying, onYearChange, onTogglePlay }: TimelineProps) => {
  const currentIndex = Math.max(0, years.indexOf(currentYear));
  const dotPct = years.length > 1 ? (currentIndex / (years.length - 1)) * 100 : 0;

  const trackRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    setTrackWidth(el.offsetWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      setTrackWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const labelIndices = useMemo(() => {
    const set = new Set<number>();
    if (!years.length) return set;
    if (years.length === 1) {
      set.add(0);
      return set;
    }
    const widthBudget = trackWidth || years.length * APPROX_LABEL_WIDTH;
    const maxLabels = Math.max(2, Math.floor(widthBudget / APPROX_LABEL_WIDTH));
    if (maxLabels >= years.length) {
      for (let i = 0; i < years.length; i++) set.add(i);
      return set;
    }
    const numGaps = maxLabels - 1;
    const totalDist = years.length - 1;
    const baseStep = Math.floor(totalDist / numGaps);
    const remainder = totalDist - baseStep * numGaps;
    let pos = 0;
    set.add(pos);
    for (let i = 0; i < numGaps; i++) {
      const extra =
        Math.floor(((i + 1) * remainder) / numGaps) - Math.floor((i * remainder) / numGaps);
      pos += baseStep + extra;
      set.add(pos);
    }
    return set;
  }, [trackWidth, years.length]);

  const goToIndex = useCallback(
    (idx: number, { focus = false }: { focus?: boolean } = {}) => {
      const clamped = Math.min(Math.max(idx, 0), years.length - 1);
      if (years[clamped] === currentYear) return;
      if (isPlaying) onTogglePlay();
      onYearChange(years[clamped]);
      if (focus) {
        requestAnimationFrame(() => tickRefs.current[clamped]?.focus());
      }
    },
    [years, currentYear, isPlaying, onTogglePlay, onYearChange]
  );

  const indexFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el || years.length <= 1) return 0;
      const rect = el.getBoundingClientRect();
      const usable = rect.width - 24;
      const x = clientX - rect.left - 12;
      const t = usable > 0 ? x / usable : 0;
      return Math.round(t * (years.length - 1));
    },
    [years.length]
  );

  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
      goToIndex(indexFromClientX(e.clientX));
    },
    [goToIndex, indexFromClientX]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      goToIndex(indexFromClientX(e.clientX));
    },
    [goToIndex, indexFromClientX]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
      let nextIdx = i;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          nextIdx = i + 1;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          nextIdx = i - 1;
          break;
        case 'Home':
          nextIdx = 0;
          break;
        case 'End':
          nextIdx = years.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      goToIndex(nextIdx, { focus: true });
    },
    [goToIndex, years.length]
  );

  return (
    <div className="flex items-start gap-3" role="group" aria-label="Year timeline">
      <button
        aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
        aria-pressed={isPlaying}
        type="button"
        onClick={onTogglePlay}
        className="border-brand-800/20 text-brand-800 hover:bg-brand-800/10 focus-visible:ring-brand-800 flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:transition-colors"
      >
        {isPlaying ? (
          <PauseIcon aria-hidden="true" className="h-3 w-3" />
        ) : (
          <PlayIcon aria-hidden="true" className="ml-0.5 h-3 w-3" />
        )}
      </button>

      <div ref={trackRef} className="relative flex-1">
        <div
          className="relative mt-2 h-10 cursor-pointer touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {years.map((y, i) => {
            const isCurrent = y === currentYear;
            const showLabel = labelIndices.has(i);
            return (
              <button
                key={y}
                ref={(el) => {
                  tickRefs.current[i] = el;
                }}
                type="button"
                aria-label={`Year ${y}`}
                aria-current={isCurrent ? 'true' : undefined}
                tabIndex={isCurrent ? 0 : -1}
                onClick={() => goToIndex(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                style={{
                  left: `calc(12px + (100% - 24px) * ${i / Math.max(1, years.length - 1)})`,
                }}
                className="focus-visible:ring-brand-800 absolute top-0 flex h-10 -translate-x-1/2 cursor-pointer flex-col items-center justify-start gap-1 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block',
                    isCurrent ? 'bg-brand-800 h-1.5 w-0.5 translate-y-1' : 'h-1.5 w-px bg-black/56'
                  )}
                />
                {showLabel && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'text-[12px] leading-5',
                      isCurrent ? 'text-brand-800 font-bold' : 'font-normal text-black/56'
                    )}
                  >
                    {y}
                  </span>
                )}
              </button>
            );
          })}
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              'pointer-events-none absolute -top-1.75 -translate-x-1/2',
              !isDragging &&
                'motion-safe:transition-[left] motion-safe:duration-150 motion-safe:ease-out'
            )}
            style={{ left: `calc(12px + (100% - 24px) * ${dotPct / 100})` }}
          >
            <path d="M0 0H12V6L6 12L0 6V0Z" fill="#00857F" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
