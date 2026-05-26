import cn from '@/lib/classnames';

import { LuPause, LuPlay } from 'react-icons/lu';

const PauseIcon = LuPause as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
const PlayIcon = LuPlay as unknown as (p: React.SVGProps<SVGSVGElement>) => JSX.Element;

type TimelineSliderProps = {
  years: number[];
  currentYear: number;
  isPlaying: boolean;
  onYearChange: (year: number) => void;
  onTogglePlay: () => void;
};

const TimelineSlider = ({
  years,
  currentYear,
  isPlaying,
  onYearChange,
  onTogglePlay,
}: TimelineSliderProps) => {
  const currentIndex = Math.max(0, years.indexOf(currentYear));
  const dotPct = years.length > 1 ? (currentIndex / (years.length - 1)) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <button
        aria-label={isPlaying ? 'Pause' : 'Play'}
        aria-pressed={isPlaying}
        type="button"
        onClick={onTogglePlay}
        className="border-brand-800 text-brand-800 hover:bg-brand-800/10 focus-visible:ring-ring flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {isPlaying ? (
          <PauseIcon aria-hidden="true" className="h-3.5 w-3.5" />
        ) : (
          <PlayIcon aria-hidden="true" className="ml-0.5 h-3.5 w-3.5" />
        )}
      </button>

      <div className="relative flex-1">
        <div className="relative h-4">
          {years.map((y, i) => {
            const isCurrent = y === currentYear;
            return (
              <button
                key={y}
                type="button"
                aria-label={`Select year ${y}`}
                aria-current={isCurrent ? 'true' : undefined}
                onClick={() => {
                  if (isPlaying) onTogglePlay();
                  onYearChange(y);
                }}
                style={{
                  left: `calc(12px + (100% - 24px) * ${i / Math.max(1, years.length - 1)})`,
                }}
                className="absolute top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block h-1.5 w-px',
                    isCurrent ? 'bg-brand-800 w-0.5' : 'bg-black/56'
                  )}
                />
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
            className="pointer-events-none absolute top-2.5 -translate-x-1/2 -translate-y-[calc(50%+10px)] transition-[left] duration-150 ease-out"
            style={{ left: `calc(12px + (100% - 24px) * ${dotPct / 100})` }}
          >
            <path d="M0 0H12V6L6 12L0 6V0Z" fill="#00857F" />
          </svg>
        </div>

        <div className="relative mt-1 flex w-full justify-between">
          {years.map((y, i) => {
            const isCurrent = y === currentYear;
            return (
              <button
                key={y}
                type="button"
                aria-label={`Select year ${y}`}
                aria-current={isCurrent ? 'true' : undefined}
                onClick={() => {
                  if (isPlaying) onTogglePlay();
                  onYearChange(y);
                }}
                style={{
                  position: 'absolute',
                  left: `calc(12px + (100% - 24px) * ${i / Math.max(1, years.length - 1)})`,
                  transform: 'translateX(-50%)',
                }}
                className={cn(
                  'cursor-pointer text-[12px] leading-5 whitespace-nowrap focus-visible:outline-none',
                  isCurrent
                    ? 'text-brand-800 font-bold'
                    : 'font-normal text-black/56 hover:text-black/80'
                )}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;
